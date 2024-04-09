import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const MealSelectionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { meal, mealTime, updateTotalCalories } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const USDA_API_KEY = "RnflfahJlR3tL4JQISfmMDWaqGRBZoLWZLt8Uada";
  const API_URL = "https://api.nal.usda.gov/fdc/v1/foods/";

  const searchFood = async () => {
    try {
      const response = await fetch(
        `${API_URL}search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data.foods) {
        const uniqueResults = [];
        const seenDescriptions = new Set();
        
        data.foods.forEach((food) => {
          if (!seenDescriptions.has(food.description)) {
            seenDescriptions.add(food.description);
            uniqueResults.push(food);
          }
        });
  
        setSearchResults(uniqueResults);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddFood = (selectedFood) => {
    if (selectedFood.fdcId) {
        navigation.navigate("MealDetailsScreen", {
          fdcId: selectedFood.fdcId,
          mealTime: route.params.mealTime || meal,
          updateTotalCalories: updateTotalCalories,
        });
    }
  };

  useEffect(() => {
    if (searchQuery !== "") {
      searchFood();
    }
  }, [searchQuery]);

  const title = `Search for ${meal ? `${meal} items` : mealTime ? `${mealTime} items` : "items"}`;

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <Text style={[styles.title, {color: theme.color}]}>{title}</Text>

      <TextInput
        placeholder="Search for food..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={[styles.searchInput, {color: theme.color}]}
      />
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleAddFood(item)}
            style={styles.resultItem}
          >
            <Text style={[styles.resultItemText, {color: theme.color}]}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  searchInput: {
    height: 50,
    color: "#000",
    fontSize: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  resultItemText: {
    fontSize: 18,
    color: "#000",
  },
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
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default MealSelectionScreen;
