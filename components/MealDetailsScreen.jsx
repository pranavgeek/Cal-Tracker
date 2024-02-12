import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MealDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { fdcId, mealTime, updateTotalCalories } = route.params;
  const [foodDetails, setFoodDetails] = useState(null);

  const fetchFoodDetails = async () => {
    try {
      const USDA_API_KEY = "RnflfahJlR3tL4JQISfmMDWaqGRBZoLWZLt8Uada";
      const API_URL = "https://api.nal.usda.gov/fdc/v1/food/";

      const response = await fetch(
        `${API_URL}${fdcId}?api_key=${USDA_API_KEY}`
      );
      const data = await response.json();

      if (data) {
        setFoodDetails(data);
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching food details:", error);
    }
  };

  const getNutrientAmount = (nutrientKey) => {
    if (foodDetails && foodDetails.labelNutrients) {
      const nutrient = foodDetails.labelNutrients[nutrientKey];
      if (nutrient) {
        console.log(`Nutrient ${nutrientKey}:`, nutrient);
        return nutrient.value;
      } else {
        console.error(`Nutrient ${nutrientKey} not found`);
        return "N/A";
      }
    } else {
      console.error("Invalid food details structure");
      return "N/A";
    }
  };

  const addToMeal = async () => {
    try {
      if (foodDetails && mealTime) {
        // Fetch existing meals from storage
        const existingMeals = await AsyncStorage.getItem("addedMeals");
        const meals = existingMeals ? JSON.parse(existingMeals) : {};

        // Add the new meal to the specific mealTime
        meals[mealTime] = meals[mealTime] || [];
        meals[mealTime].push({
          name: foodDetails.description,
          nutrients: { calories: getNutrientAmount("calories") },
        });

        // Save the updated meals back to storage
        await AsyncStorage.setItem("addedMeals", JSON.stringify(meals));

        // Update total calories in MainAppScreen
        updateTotalCalories(meals);
      }
    } catch (error) {
      console.error("Error saving added meals:", error);
    }

    // Navigate to the AddedMealsScreen
    navigation.navigate("AddedMealsScreen");
  };

  useEffect(() => {
    if (fdcId) {
      fetchFoodDetails();
    }
  }, [fdcId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Details</Text>
      {foodDetails ? (
        <>
          <Text style={styles.title}>{foodDetails.description}</Text>
          <Text style={styles.detailsColor}>{`Calories: ${getNutrientAmount(
            "calories"
          )} kcal`}</Text>
          <Text style={styles.detailsColor}>{`Protein: ${getNutrientAmount(
            "protein"
          )} g`}</Text>
          <Text style={styles.detailsColor}>{`Carbs: ${getNutrientAmount(
            "carbohydrates"
          )} g`}</Text>
          <Text style={styles.detailsColor}>{`Fat: ${getNutrientAmount(
            "fat"
          )}`}</Text>
          {/* Add more information as needed */}
          <Button title="Add to Meal" onPress={addToMeal} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  detailsColor: {
    fontSize: 20,
    color: "white",
  },
});

export default MealDetailsScreen;
