// components/MainAppScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import MealSelectionScreen from "./MealSelectionScreen";
import AddedMealsScreen from "./AddedMealsScreen";
// import CalorieProgressBar from "./CalorieProgressBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MainAppScreen = ({ route, navigation }) => {
  const { totalCalories } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [consumedCalories, setConsumedCalories] = useState(0);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleMealSelection = (meal) => {
    console.log(`Selected meal: ${meal}`);
    navigation.navigate("MealSelectionScreen", { meal, updateTotalCalories });
    toggleModal();
  };

  const viewAddedMeals = () => {
    navigation.navigate("AddedMealsScreen", { updateTotalCalories });
  };

  const updateTotalCalories = (meals) => {
    // Calculate consumed calories from meals and update consumedCalories state
    let consumed = 0;
    Object.values(meals).forEach((mealArray) => {
      mealArray.forEach((meal) => {
        consumed += meal.nutrients?.calories || 0;
      });
    });
    setConsumedCalories(Math.floor(consumed));
  };

  const remainingCalories = totalCalories - consumedCalories;
  const removeMealCal = remainingCalories + consumedCalories

  //Reset Data
  const resetUserDetails = async () => {
    try {
      await AsyncStorage.removeItem("userDetails");
      navigation.replace("UserInputScreen");
    } catch (error) {
      console.error("Error clearing user details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Nutrition}>Nutrition</Text>
      <View style={styles.nutritionContainer}>
        <Text style={styles.caloriesText}>
          Eat up to {remainingCalories > 0 ? remainingCalories || removeMealCal : 0} cal
        </Text>
        <TouchableOpacity
          onPress={() => {
            toggleModal();
          }}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Select a Meal You Would Like to Track
              </Text>
              <TouchableOpacity
                onPress={() => handleMealSelection("Breakfast")}
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>Breakfast</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleMealSelection("Lunch")}
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>Lunch</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleMealSelection("Dinner")}
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>Dinner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity onPress={viewAddedMeals} style={styles.viewMealsButton}>
        <Text style={styles.viewMealsButtonText}>View Added Meals</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={resetUserDetails} style={styles.viewMealsButton}>
        <Text style={styles.viewMealsButtonText}>Reset</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#000",
  },
  nutritionContainer: {
    backgroundColor: "whitesmoke",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  caloriesText: {
    fontSize: 18,
  },
  addButton: {
    height: 50,
    width: 50,
    backgroundColor: "#000000",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuItemText: {
    fontSize: 18,
  },
  Nutrition: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "flex-start",
    color: "white",
  },
  viewMealsButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF8559",
    borderRadius: 10,
  },
  viewMealsButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default MainAppScreen;
