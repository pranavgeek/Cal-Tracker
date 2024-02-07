// components/UserInputScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CaloriesCalculator from "../Utility/CaloriesCalculator";

const UserInputScreen = ({ navigation, storeUserDetails }) => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");

  const calculateCalories = () => {
    const bmr = CaloriesCalculator.calculateBMR(
      parseInt(age),
      gender,
      parseInt(height),
      parseInt(weight)
    );
    const totalCalories = CaloriesCalculator.calculateTotalCalories(
      bmr,
      activityLevel
    );

    storeUserDetails({
      age,
      gender,
      height,
      weight,
      activityLevel,
      totalCalories,
    });

    navigation.navigate("MainAppScreen", { totalCalories });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Information</Text>

      <Text style={styles.inputLabel}>What's your age?</Text>
      <TextInput
        placeholder="Enter your age"
        keyboardType="numeric"
        value={age}
        onChangeText={(text) => setAge(text)}
        style={styles.input}
      />

      <Text style={styles.inputLabel}>What's your sex?</Text>
      <RNPickerSelect
        placeholder={{ label: "Select gender", value: null }}
        onValueChange={(value) => setGender(value)}
        items={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input,
          iconContainer: {
            top: 10,
            right: 12,
          },
        }}
      />

      <Text style={styles.inputLabel}>How tall are you? (in cm):</Text>
      <TextInput
        placeholder="Enter your height"
        keyboardType="numeric"
        value={height}
        onChangeText={(text) => setHeight(text)}
        style={styles.input}
      />

      <Text style={styles.inputLabel}>What's your weight? (in kg):</Text>
      <TextInput
        placeholder="Enter your weight"
        keyboardType="numeric"
        value={weight}
        onChangeText={(text) => setWeight(text)}
        style={styles.input}
      />

      <Text style={styles.inputLabel}>Activity Level:</Text>
      <RNPickerSelect
        placeholder={{ label: "Select activity level", value: null }}
        onValueChange={(value) => setActivityLevel(value)}
        items={[
          { label: "Sedentary", value: "sedentary" },
          { label: "Lightly Active", value: "lightlyActive" },
          { label: "Moderately Active", value: "moderatelyActive" },
          { label: "Very Active", value: "veryActive" },
        ]}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input,
          iconContainer: {
            top: 10,
            right: 12,
          },
        }}
      />

      <TouchableOpacity onPress={calculateCalories} style={styles.button}>
        <Text style={styles.buttonText}>Calculate Calories</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
    backgroundColor: '#000'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: 'flex-start',
    color: "white",
  },
  inputLabel: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#fff",
  },
  pickerLabel: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  picker: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
    color: "#333",
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#ff7f50",
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
  },
});

export default UserInputScreen;
