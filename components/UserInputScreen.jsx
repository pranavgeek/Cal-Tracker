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
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={(text) => setAge(text)}
      />

      <RNPickerSelect
        placeholder={{ label: 'Select gender', value: null }}
        onValueChange={(value) => setGender(value)}
        items={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ]}
      />

      <TextInput
        placeholder="Height (in cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={(text) => setHeight(text)}
      />

      <TextInput
        placeholder="Weight (in kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={(text) => setWeight(text)}
      />

      <RNPickerSelect
        placeholder={{ label: 'Select activity level', value: null }}
        onValueChange={(value) => setActivityLevel(value)}
        items={[
          { label: 'Sedentary', value: 'sedentary' },
          { label: 'Lightly Active', value: 'lightlyActive' },
          { label: 'Moderately Active', value: 'moderatelyActive' },
          { label: 'Very Active', value: 'veryActive' },
        ]}
      />

      <TouchableOpacity onPress={calculateCalories}>
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
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    // Add styles for input components as needed
    button: {
      backgroundColor: '#3498db',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
  });

export default UserInputScreen;
