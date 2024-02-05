// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserInputScreen from './components/UserInputScreen';
import MainAppScreen from './components/MainAppScreen';

const Stack = createStackNavigator();

const App = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkUserDetails = async () => {
      try {
        const userDetails = await AsyncStorage.getItem('userDetails');
        if (userDetails) {
          setUserData(JSON.parse(userDetails));
        }
      } catch (error) {
        console.error('Error checking user details:', error);
      }
    };

    checkUserDetails();
  }, []);

  const storeUserDetails = async (details) => {
    try {
      await AsyncStorage.setItem('userDetails', JSON.stringify(details));
      setUserData(details);
    } catch (error) {
      console.error('Error storing user details:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userData ? (
          <Stack.Screen
            name="MainAppScreen"
            component={MainAppScreen}
            initialParams={userData}
          />
        ) : (
          <Stack.Screen
            name="UserInputScreen"
            options={{ title: 'Enter Your Details' }}
          >
            {(props) => (
              <UserInputScreen {...props} storeUserDetails={storeUserDetails} />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
