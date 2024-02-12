// components/MealSelectionScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';

const MealSelectionScreen = ({ route }) => {
  const { meal } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const USDA_API_KEY = 'RnflfahJlR3tL4JQISfmMDWaqGRBZoLWZLt8Uada';
  const API_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search/';

  const searchFood = async () => {
    try {
      const response = await fetch(
        `${API_URL}?api_key=${USDA_API_KEY}&query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.foods) {
        setSearchResults(data.foods);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (searchQuery !== '') {
      searchFood();
    }
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for {meal} items</Text>
      <TextInput
        placeholder="Search for food..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={styles.searchInput}
      />
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultItemText}>{item.description}</Text>
              {item.fdcId && <Text>Food ID: {item.fdcId}</Text>}
            </View>
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
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  searchInput: {
    height: 50,
    color: 'white',
    fontSize: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultItemText: {
    fontSize: 18,
    color: 'white', // Set the text color to white
  },
});

export default MealSelectionScreen;
