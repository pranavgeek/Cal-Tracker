// components/UserInputScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CaloriesCalculator from '../Utility/CaloriesCalculator';

const UserInputScreen = ({ navigation, storeUserDetails }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');

  const calculateCalories = () => {
    const bmr = CaloriesCalculator.calculateBMR(
      parseInt(age),
      gender,
      parseInt(height),
      parseInt(weight)
    );
    const totalCalories = CaloriesCalculator.calculateTotalCalories(bmr, activityLevel);

    storeUserDetails({
      age,
      gender,
      height,
      weight,
      activityLevel,
      totalCalories,
    });

    navigation.navigate('MainAppScreen', { totalCalories });
  };

  return (
    <View style={styles.container}>
      <Text>Enter your details:</Text>

      <TextInput
        style = {styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={(text) => setAge(text)}
      />

      <RNPickerSelect
        style={styles.picker}
        placeholder={{ label: 'Select gender', value: null }}
        onValueChange={(value) => setGender(value)}
        items={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ]}
      />

      <TextInput
        style = {styles.input}
        placeholder="Height (in cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={(text) => setHeight(text)}
      />

      <TextInput
        style ={styles.input}
        placeholder="Weight (in kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={(text) => setWeight(text)}
      />

      <RNPickerSelect
        style={styles.picker}
        placeholder={{ label: 'Select activity level', value: null }}
        onValueChange={(value) => setActivityLevel(value)}
        items={[
          { label: 'Sedentary', value: 'sedentary' },
          { label: 'Lightly Active', value: 'lightlyActive' },
          { label: 'Moderately Active', value: 'moderatelyActive' },
          { label: 'Very Active', value: 'veryActive' },
        ]}
      />

      <TouchableOpacity onPress={calculateCalories}
      style ={styles.button}>
        <Text>Calculate Calories</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#7da832',
   },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333', 
  },
  input: {
    width: '100%',
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserInputScreen;
