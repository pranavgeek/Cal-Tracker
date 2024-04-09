import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        const themeSettings = await AsyncStorage.getItem('themeSettings');
        if (themeSettings) {
          const { darkMode: savedDarkMode } = JSON.parse(themeSettings);
          setDarkMode(savedDarkMode);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading theme settings:', error);
      }
    };

    loadThemeSettings();
  }, []);

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    saveThemeSettings({ darkMode: newDarkMode });
  };

  const saveThemeSettings = async (settings) => {
    try {
      await AsyncStorage.setItem('themeSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  };

  const theme = {
    backgroundColor: darkMode ? '#000' : '#E3DDD3',
    btnBackgroundColor: darkMode ? '#E3DDD3' : '#000',
    btncolor: darkMode ? '#000' : '#E3DDD3',
    nutritionContainer: darkMode ? '#E3DDD3' : '#000',
    caloriesColor: darkMode ? '#000' : '#E3DDD3',
    modalBackgroundColor: darkMode ? '#E3DDD3' : '#000',
    modalColor: darkMode ? '#000' : '#E3DDD3',
    inputColor: darkMode ? '#000' : '#E3DDD3',
    color: darkMode ? '#E3DDD3' : '#000',
    logoColor: darkMode ? '#000' : '#E3DDD3',
    logoBackgroundColor: darkMode ? '#E3DDD3' : '#000',
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, theme, isLoaded }}>
      {isLoaded ? children : null}
    </ThemeContext.Provider>
  );
};
