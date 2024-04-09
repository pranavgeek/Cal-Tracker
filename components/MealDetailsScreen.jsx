import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
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

  const getCalorieColor = (nutrientKey) => {
    const nutrientAmount = parseFloat(getNutrientAmount(nutrientKey));

    if (nutrientKey === "calories") {
      if (nutrientAmount <= 200) {
        return { backgroundColor: "#4CAF50", color: "white" }; // Green
      } else if (nutrientAmount <= 500) {
        return { backgroundColor: "#FFC107", color: "black" }; // Orange
      } else {
        return { backgroundColor: "#FF5252", color: "white" }; // Red
      }
    } else if (nutrientKey === "protein") {
      if (nutrientAmount <= 10) {
        return { backgroundColor: "#FF5252", color: "white" }; // Red
      } else if (nutrientAmount <= 20) {
        return { backgroundColor: "#FFC107", color: "black" }; // Orange
      } else {
        return { backgroundColor: "#4CAF50", color: "white" }; // Green
      }
    } else if (nutrientKey === "carbohydrates") {
      if (nutrientAmount <= 30) {
        return { backgroundColor: "#264653", color: "white" }; // Dark Teal
      } else if (nutrientAmount <= 60) {
        return { backgroundColor: "#2A9D8F", color: "white" }; // Dark Cyan
      } else {
        return { backgroundColor: "#E9C46A", color: "black" }; // Mustard
      }
    } else if (nutrientKey === "fat") {
      if (nutrientAmount <= 5) {
        return { backgroundColor: "#E9C46A", color: "black" }; // Mustard
      } else if (nutrientAmount <= 20) {
        return { backgroundColor: "#F4A261", color: "black" }; // Light Orange
      } else {
        return { backgroundColor: "#E76F51", color: "white" }; // Rust
      }
    }
  };

  const addToMeal = async () => {
    try {
      if (foodDetails && mealTime) {
        // Fetch existing meals from storage
        const existingMeals = await AsyncStorage.getItem("addedMeals");
        console.log("Existing meals from storage:", existingMeals);
        const meals = existingMeals ? JSON.parse(existingMeals) : {};

        // Add the new meal to the specific mealTime
        meals[mealTime] = meals[mealTime] || [];
        meals[mealTime].push({
          name: foodDetails.description,
          nutrients: { calories: getNutrientAmount("calories") },
        });

        // Save the updated meals back to storage
        await AsyncStorage.setItem("addedMeals", JSON.stringify(meals));
        console.log("Updated meals:", meals);
        // Update total calories in MainAppScreen
        if (route.params.updateTotalCalories) {
          // Ensure updateTotalCalories is defined before calling it
          route.params.updateTotalCalories(meals);
        }
      }
    } catch (error) {
      console.error("Error saving added meals:", error);
    }

    // Navigate to the AddedMealsScreen
    navigation.navigate("AddedMealsScreen", { updateTotalCalories });
  };

  useEffect(() => {
    if (fdcId) {
      fetchFoodDetails();
    }
  }, [fdcId]);

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <Text style={[styles.title, {color: theme.color}]}>Food Details</Text>
      {foodDetails ? (
        <View style={{ padding: 20 }}>
          <Text style={[styles.foodTitle, {color: theme.color}]}>{foodDetails.description}</Text>
          <Text
            style={[
              styles.detailsColor,
              { backgroundColor: getCalorieColor("calories").backgroundColor },
            ]}
          >
            {`Calories: ${getNutrientAmount("calories")} kcal`}
          </Text>
          <Text
            style={[
              styles.detailsColor,
              { backgroundColor: getCalorieColor("protein").backgroundColor },
            ]}
          >
            {`Protein: ${getNutrientAmount("protein")} g`}
          </Text>
          <Text
            style={[
              styles.detailsColor,
              {
                backgroundColor:
                  getCalorieColor("carbohydrates").backgroundColor,
              },
            ]}
          >
            {`Carbs: ${getNutrientAmount("carbohydrates")} g`}
          </Text>
          <Text
            style={[
              styles.detailsColor,
              { backgroundColor: getCalorieColor("fat").backgroundColor },
            ]}
          >
            {`Fat: ${getNutrientAmount("fat")}`}
          </Text>
        </View>
      ) : (
        <Text style={[{ color: "white", textAlign: "center", fontSize: 20 }, {color: theme.color}]}>
          Loading...
        </Text>
      )}
      <TouchableOpacity style={[styles.addToMealButton, {backgroundColor: theme.btnBackgroundColor}]} onPress={addToMeal}>
        <Text style={[styles.addToMealButtonText, {color: theme.btncolor}]}>Add to Meal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#E3DDD3",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  foodTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  detailsColor: {
    fontSize: 20,
    color: "white",
    padding: 15,
  },
  addToMealButton: {
    backgroundColor: "#000", 
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginTop: 20,
  },
  addToMealButtonText: {
    color: "#E3DDD3",
    fontSize: 18,
  },
});

export default MealDetailsScreen;
