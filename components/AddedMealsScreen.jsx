import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useTheme } from "../Utility/ThemeContext";

const AddedMealsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { updateTotalCalories } = route.params;
  const [loadedMeals, setLoadedMeals] = useState(null);
  const [editMeal, setEditMeal] = useState(null);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const { theme } = useTheme();
  const [isClearAllModalVisible, setClearAllModalVisible] = useState(false);
  const [mealToRemove, setMealToRemove] = useState(null);
  const [copiedMeals, setCopiedMeals] = useState(null);

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

  const showToast = (type, message) => {
    Toast.show({
      type: type,
      position: 'bottom',
      text1: message,
      visibilityTime: 3000,
      autoHide: true,
    });
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
        route.params.updateTotalCalories(
          parsedMeals,
          mealToRemove.nutrients?.calories || 0
        );
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
    const order = ["Breakfast", "Lunch", "Dinner"]; // Customize the order as needed
    return mealTimes.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };

   const handleCopyMeal = (mealTime) => {
    setCopiedMeals(loadedMeals[mealTime]);
    showToast('success', "Meals Copied.")
  };

  // Function to handle pasting meals to a specific meal time
  const handlePasteMeal = async (mealTime) => {
    if (copiedMeals) {
      try {
        const updatedMeals = { ...loadedMeals };
        let replacedCalories = 0;
  
        // Calculate the total calories of the meals being replaced
        Object.keys(updatedMeals).forEach((time) => {
          if (time !== mealTime) {
            updatedMeals[time].forEach((meal) => {
              replacedCalories += meal.nutrients?.calories || 0;
            });
          }
        });
  
        // Remove the meals being replaced from other meal times
        Object.keys(updatedMeals).forEach((time) => {
          if (time !== mealTime) {
            updatedMeals[time] = updatedMeals[time].filter(
              (meal) => !copiedMeals.includes(meal)
            );
          }
        });
  
        updatedMeals[mealTime] = copiedMeals;
  
        await AsyncStorage.setItem("addedMeals", JSON.stringify(updatedMeals));
  
        setLoadedMeals(updatedMeals);
        setCopiedMeals(null);
        showToast('success', "Meals Pasted.")

        // Update total calories on the MainAppScreen
        updateTotalCalories(updatedMeals, replacedCalories);
      } catch (error) {
        console.error("Error pasting meal:", error);
      }
    }
  };  
  

  const handleClearAllMeals = async () => {
    try {

      let consumed = 0;
      Object.values(loadedMeals).forEach((mealArray) => {
        mealArray.forEach((meal) => {
          consumed += meal.nutrients?.calories || 0;
        });
      });

      await AsyncStorage.removeItem("addedMeals");

      if (route.params.updateTotalCalories) {
        route.params.updateTotalCalories(consumed);
      }

      setLoadedMeals(null); 
      setClearAllModalVisible(false);
    } catch (error) {
      console.error("Error clearing meals:", error);
    }
  };  

  useEffect(() => {
    loadMeals();
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.header}>
      <Text style={[styles.title, {color: theme.color}]}>
        {loadedMeals ? "Added Meals" : "Yet No Meals Added"}
      </Text>        
      {loadedMeals && Object.keys(loadedMeals).length > 0 && (
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={() => setClearAllModalVisible(true)}
        >
          <Text style={styles.clearButtonText}>Delete All</Text>
        </TouchableOpacity>
      )}
      </View>
      {getSortedMealTimes(loadedMeals || {}).map((mealTime) => (
        <View key={mealTime}>
          <View style={styles.mealTimeContainer}>
            <View>
              <Text style={[styles.mealTime, {color: theme.color}]}>{mealTime}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() => handleAddMeal(mealTime)}
                style={styles.addButton}
              >
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
              <TouchableOpacity
                onPress={() => handleCopyMeal(mealTime)}
                style={[styles.iconButton, {backgroundColor: theme.logoBackgroundColor}]}
              >
                <FontAwesome name="copy" size={20} color={theme.logoColor} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePasteMeal(mealTime)}
                style={[styles.iconButton, {backgroundColor: theme.logoBackgroundColor}]}
              >
                <FontAwesome name="paste" size={20} color={theme.logoColor} />
              </TouchableOpacity>
            </View>
          </View>
          {loadedMeals[mealTime].map((meal, mealIndex) => (
            <View key={mealIndex} style={styles.mealItemContainer}>
              <Text style={[styles.mealItem, {color: theme.color}]}>
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
          <View style={[styles.modalContent, {backgroundColor: theme.modalBackgroundColor}]}>
            <Text style={[styles.modalTitle, {color: theme.modalColor}]}>Confirm Removal</Text>
            <Text style={{color: theme.modalColor}}>{`Are you sure you want to delete this ${mealToRemove?.name} ?`}</Text>
            <TouchableOpacity
              onPress={handleConfirmRemove}
              style={styles.confirmButton}
            >
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
      {/* Clear all meals */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isClearAllModalVisible}
        onRequestClose={() => setClearAllModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {backgroundColor: theme.modalBackgroundColor}]}>
            <Text style={[styles.modalTitle, {color: theme.modalColor}]}>Clear All Meals?</Text>
            <Text style={{color: theme.modalColor}}>{`Are you sure you want to delete all meals?`}</Text>
            <TouchableOpacity
              onPress={handleClearAllMeals}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setClearAllModalVisible(false)}
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
    backgroundColor: "#E3DDD3",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginRight: 10,
  },
  mealTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  mealTime: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 25,
  },
  mealItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealItem: {
    fontSize: 18,
    color: "#000",
    marginTop: 22,
  },
  editButton: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  editButtonText: {
    color: "white",
    fontSize: 15,
  },
  addButton: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
  iconButton: {
    padding: 8,
    backgroundColor: "#000",
    borderRadius: 10,
    marginLeft: 10,
  },
  removeButton: {
    backgroundColor: "red",
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
  },
  removeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  clearButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "red",
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
