import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AddedMealsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { updateTotalCalories } = route.params;
  const [loadedMeals, setLoadedMeals] = useState(null);
  const [editMeal, setEditMeal] = useState(null);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [mealToRemove, setMealToRemove] = useState(null);

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

  // Function to handle toggling the edit state for a specific mealTime
  const handleToggleEditMealTime = (mealTime) => {
    setEditMeal((prev) => (prev === mealTime ? null : mealTime));
  };

  // Function to handle removing an individual meal
  const handleRemoveMeal = (mealToRemove) => {
    setMealToRemove(mealToRemove);
    setConfirmationModalVisible(true);
  };

  const handleConfirmRemove = async () => {
    try {
      const parsedMeals = { ...loadedMeals };
      const updatedMeals = parsedMeals[editMeal].filter(
        (meal) => meal.name !== mealToRemove.name
      );
      parsedMeals[editMeal] = updatedMeals;

      await AsyncStorage.setItem("addedMeals", JSON.stringify(parsedMeals));
      // Update total calories in MainAppScreen for meal removal
    if (route.params.updateTotalCalories) {
      route.params.updateTotalCalories(parsedMeals, mealToRemove.nutrients?.calories || 0);
    }
      setLoadedMeals(parsedMeals);
      setConfirmationModalVisible(false);
    } catch (error) {
      console.error("Error removing meal:", error);
    }
  };

  const handleAddMeal = (mealTime) => {
    navigation.navigate("MealSelectionScreen", {
      mealTime,
      updateTotalCalories,
    });
  };

  const getSortedMealTimes = (meals) => {
    const mealTimes = Object.keys(meals);
    const order = ['Breakfast', 'Lunch', 'Dinner']; // Customize the order as needed
    return mealTimes.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };

  useEffect(() => {
    loadMeals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Added Meals</Text>
      {getSortedMealTimes(loadedMeals || {}).map((mealTime) => (
        <View key={mealTime}>
          <View style={styles.mealTimeContainer}>
            <Text style={styles.mealTime}>{mealTime}</Text>
            <TouchableOpacity onPress={() => handleAddMeal(mealTime)} style={styles.addButton}>
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleToggleEditMealTime(mealTime)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {editMeal === mealTime ? "Done" : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>
          {loadedMeals[mealTime].map((meal, mealIndex) => (
            <View key={mealIndex} style={styles.mealItemContainer}>
              <Text style={styles.mealItem}>
                {meal.name} - Calories: {meal.nutrients?.calories} kcal
              </Text>
              {editMeal === mealTime && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveMeal(meal)}
                >
                  <Text style={styles.removeButtonText}>&#10134;</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      ))}
      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
        onRequestClose={() => setConfirmationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Removal</Text>
            <Text>{`Are you sure you want to delete this ${mealToRemove?.name} ?`}</Text>
            <TouchableOpacity onPress={handleConfirmRemove} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setConfirmationModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  mealTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealTime: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
    marginTop: 25,
  },
  mealItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealItem: {
    fontSize: 18,
    color: "white",
    marginTop: 22
  },
  editButton: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontSize: 15,
  },
  addButton: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 10,
    marginLeft: 150,
  },
  removeButton: {
    backgroundColor: "red",
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10
  },
  removeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white", 
    marginTop: 2
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
  addText: {
    color: "white",
    fontSize: 15,
  },
});

export default AddedMealsScreen;
