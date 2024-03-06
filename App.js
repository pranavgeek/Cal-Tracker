import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserInputScreen from "./components/UserInputScreen";
import MainAppScreen from "./components/MainAppScreen";
import MealSelectionScreen from "./components/MealSelectionScreen";
import MealDetailsScreen from "./components/MealDetailsScreen";
import AddedMealsScreen from "./components/AddedMealsScreen";
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();

const App = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkUserDetails = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("userDetails");
        if (userDetails) {
          setUserData(JSON.parse(userDetails));
        }
      } catch (error) {
        console.error("Error checking user details:", error);
      }
    };

    checkUserDetails();
  }, []);

  const storeUserDetails = async (details) => {
    try {
      await AsyncStorage.setItem("userDetails", JSON.stringify(details));
      setUserData(details);
    } catch (error) {
      console.error("Error storing user details:", error);
    }
  };

  return (
      <NavigationContainer>
        <Stack.Navigator>
          {userData ? (
            <Stack.Screen
              name="MainAppScreen"
              options={{
                title: "CaloriesHunt",
                headerLeft: null,
                headerStyle: {
                  backgroundColor: "#FF8559",
                },
                headerTitleStyle: {
                  color: "white",
                  fontSize: 30,
                  marginLeft: -170,
                },
              }}
              component={MainAppScreen}
              initialParams={userData}
            />
          ) : (
            <Stack.Screen
              name="UserInputScreen"
              options={{
                title: "CaloriesHunt",
                headerLeft: null,
                headerStyle: {
                  backgroundColor: "#FF8559",
                },
                headerTitleStyle: {
                  color: "white",
                  fontSize: 30,
                  marginLeft: -170,
                },
              }}
            >
              {(props) => (
                <UserInputScreen {...props} storeUserDetails={storeUserDetails} />
              )}
            </Stack.Screen>
          )}
          <Stack.Screen
            name="MealSelectionScreen"
            component={MealSelectionScreen}
            options={({ route, navigation }) => ({
              title: "CaloriesHunt",
              headerStyle: {
                backgroundColor: "#FF8559",
              },
              headerTitleStyle: {
                color: "white",
                fontSize: 25,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={{ color: "white", marginLeft: 20, fontSize: 30, color: 'black' }}>&#9664;</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="MealDetailsScreen"
            component={MealDetailsScreen}
            options={({ route, navigation }) => ({
              title: "CaloriesHunt",
              headerStyle: {
                backgroundColor: "#FF8559",
              },
              headerTitleStyle: {
                color: "white",
                fontSize: 25,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={{ color: "white", marginLeft: 20, fontSize: 30, color: 'black' }}>&#9664;</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="AddedMealsScreen"
            component={AddedMealsScreen}
            options={({ route, navigation }) => ({
              title: "CaloriesHunt",
              headerStyle: {
                backgroundColor: "#FF8559",
              },
              headerTitleStyle: {
                color: "white",
                fontSize: 25,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={{ color: "white", marginLeft: 20, fontSize: 30, color: 'black' }}>&#9664;</Text>
                </TouchableOpacity>
              ),
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("MainAppScreen")}>
                  <Icon name="home" size={25} color="black" style={{marginRight: 20}}/>
                </TouchableOpacity>
              )
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
