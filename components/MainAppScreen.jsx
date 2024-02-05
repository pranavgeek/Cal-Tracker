// components/MainAppScreen.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import UserInputScreen from './UserInputScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainAppScreen = ({ route, navigation }) => {
  const { totalCalories } = route.params;

  const resetUserDetails = async () => {
    try {
      // Clear the stored user details
      await AsyncStorage.removeItem('userDetails');
      // Navigate back to UserInputScreen
      navigation.navigate(UserInputScreen);
    } catch (error) {
      console.error('Error clearing user details:', error);
    }
  };

  return (
    <View>
      <Text>Total Calories: {totalCalories}</Text>
      <TouchableOpacity onPress={resetUserDetails}>
        <Text>Reset User Details</Text>
      </TouchableOpacity>
      {/* Display the rest of your app components and functionality here */}
    </View>
  );
};

export default MainAppScreen;
