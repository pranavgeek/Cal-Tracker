// components/MainAppScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import MealSelectionScreen from './MealSelectionScreen';

const MainAppScreen = ({ route, navigation }) => {
  const { totalCalories } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
   const [caloriesDistribution, setCaloriesDistribution] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleMealSelection = (meal) => {
    console.log(`Selected meal: ${meal}`);
    navigation.navigate('MealSelectionScreen', { meal });
    toggleModal();
  };

  // const divideCalories = () => {
  //   const remainingCalories = totalCalories - (caloriesDistribution.breakfast + caloriesDistribution.lunch + caloriesDistribution.dinner);

  //   setCaloriesDistribution({
  //     ...caloriesDistribution,
  //     breakfast: remainingCalories >= 656 ? 656 : remainingCalories,
  //   });
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.Nutrition}>Nutrition</Text>
      <View style={styles.nutritionContainer}>
        <Text style={styles.caloriesText}>Eat up to {totalCalories} cal</Text>
        <TouchableOpacity onPress={() => { toggleModal()}} style={styles.addButton}>
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
              <Text style={styles.modalTitle}>Select a Meal You Would Like to Track</Text>
              <TouchableOpacity
                onPress={() => handleMealSelection('Breakfast')}
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>Breakfast</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleMealSelection('Lunch')}
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>Lunch</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleMealSelection('Dinner')}
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>Dinner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#000'
  },
  nutritionContainer: {
    backgroundColor: "whitesmoke",
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  caloriesText: {
    fontSize: 18,
  },
  addButton: {
    height: 50,
    width: 50,
    backgroundColor: '#000000',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItemText: {
    fontSize: 18,
  },
  Nutrition: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: 'flex-start',
    color: "white",
  }
});

export default MainAppScreen;
