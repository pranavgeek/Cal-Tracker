// components/AddedMealsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AddedMealsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [loadedMeals, setLoadedMeals] = useState(null);

  const loadMeals = async () => {
    try {
      const savedMeals = await AsyncStorage.getItem("addedMeals");
      if (savedMeals) {
        const parsedMeals = JSON.parse(savedMeals);
        const filteredMeals = Object.fromEntries(
          Object.entries(parsedMeals).filter(
            ([mealTime, meals]) => meals.length > 0
          )
        );
        setLoadedMeals(filteredMeals);
      }
    } catch (error) {
      console.error("Error loading added meals:", error);
    }
  };

  //This function remove's the meals
  const removeMeal = async (mealTime) => {
    try {
      const savedMeals = await AsyncStorage.getItem("addedMeals");
      if (savedMeals) {
        const parsedMeals = JSON.parse(savedMeals);
        delete parsedMeals[mealTime];
        await AsyncStorage.setItem("addedMeals", JSON.stringify(parsedMeals));
        setLoadedMeals(parsedMeals);
      }
    } catch (error) {
      console.error("Error while removing meal:", error);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Added Meals</Text>
      {Object.entries(loadedMeals || {}).map(([mealTime, meals], index) => (
        <View key={index}>
          <Text style={styles.mealTime}>{mealTime}</Text>
          {meals.map((meal, mealIndex) => (
            <Text key={mealIndex} style={styles.mealItem}>
              {meal.name} - Calories: {meal.nutrients?.calories} kcal
            </Text>
          ))}
          {/* <TouchableOpacity
            onPress={() => navigation.navigate("MealSelectionScreen", {mealTime: mealTime})}
            style={styles.addButton}
          >
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => removeMeal(mealTime)}
            style={styles.removeButton}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
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
    color: "white",
  },
  mealTime: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
    marginTop: 20,
  },
  mealItem: {
    fontSize: 18,
    color: "white",
  },
  addButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  removeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  addText: {
    color: "white",
    fontSize: 16,
  },
  removeText: {
    color: "white",
    fontSize: 16,
  },
});

export default AddedMealsScreen;
