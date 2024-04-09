import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AppSettings = () => {
  const navigation = useNavigation();
  const [showMealOptions, setShowMealOptions] = useState(false);
  const [mealReminders, setMealReminders] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
  });
  const [mealReminderSwitch, setMealReminderSwitch] = useState(false);

  const showToast = (message) => {
    Toast.show({
      text1: message,
      position: 'bottom',
      type: 'success', 
      visibilityTime: 3000, 
      autoHide: true,
    });
  };
  
  const showNotificationToast = () => {
    const formattedMealTimes = Object.entries(mealReminders)
      .map(([meal, time]) => `${meal}: ${time.toLocaleTimeString()}`)
      .join('\n');

    const toastMessage = `Meal times saved`;
    showToast(toastMessage);
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem("mealSettings");
        if (savedSettings) {
          const { mealReminderSwitch, mealReminders } =
            JSON.parse(savedSettings);
          // Convert ISO strings back to Date objects
          const parsedReminders = {
            breakfast: mealReminders.breakfast
              ? new Date(mealReminders.breakfast)
              : null,
            lunch: mealReminders.lunch ? new Date(mealReminders.lunch) : null,
            dinner: mealReminders.dinner
              ? new Date(mealReminders.dinner)
              : null,
          };
          setMealReminderSwitch(mealReminderSwitch);
          setMealReminders(parsedReminders);
          setShowMealOptions(mealReminderSwitch);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      const remindersToSave = {
        mealReminderSwitch,
        mealReminders: {
          breakfast: mealReminders.breakfast?.toISOString() || null,
          lunch: mealReminders.lunch?.toISOString() || null,
          dinner: mealReminders.dinner?.toISOString() || null,
        },
      };
      const settings = JSON.stringify(remindersToSave);
      await AsyncStorage.setItem("mealSettings", settings);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  useEffect(() => {
    saveSettings();
  }, [mealReminderSwitch, mealReminders]);

  const handleScheduleNotification = async (mealType, mealTime) => {
    if (!mealReminderSwitch) {
      await Notifications.cancelScheduledNotificationAsync(mealType);
      return;
    }
  
    try {
      const now = new Date();
      const triggerTime = new Date(mealTime);
  
      if (triggerTime <= now) {
        triggerTime.setDate(triggerTime.getDate() + 2);
      }
  
      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
  
      const capitalizedMealType = capitalizeFirstLetter(mealType);
  
      let notificationBody = "";
      switch (mealType) {
        case "breakfast":
          notificationBody = "Breakfast awaits! Rise and shine!";
          break;
        case "lunch":
          notificationBody = "Time to refuel with lunch!";
          break;
        case "dinner":
          notificationBody = "Dinner is served, enjoy your meal!";
          break;
        default:
          notificationBody = `It's time for ${capitalizedMealType}!`;
          break;
      }
  
      await Notifications.scheduleNotificationAsync({
        identifier: mealType,
        content: {
          title: `${capitalizedMealType} Reminder`,
          body: notificationBody,
          sound: true,
        },
        trigger: {
          hour: triggerTime.getHours(),
          minute: triggerTime.getMinutes(),
          repeats: true,
          channelId: 'default',
          intervalMs: 24 * 60 * 60 * 1000,
        },
      });
  
      console.log(`Scheduled ${mealType} notification for ${triggerTime}`);
    } catch (error) {
      console.error(`Error scheduling ${mealType} notification:`, error);
    }
  };
  
  

  const handleSaveMealTime = () => {
    Object.entries(mealReminders).forEach(([mealType, mealTime]) => {
      if (mealTime) {
        handleScheduleNotification(mealType, mealTime);
        showNotificationToast();
      }
      navigation.navigate("MainAppScreen")
    });
    setMealReminderSwitch(true);
  };

  const handleTimeChange = (event, selectedDate, meal) => {
    if (selectedDate) {
      const updatedReminders = { ...mealReminders, [meal]: selectedDate };
      setMealReminders(updatedReminders);
    }
  };

  const handleToggleMealOptions = (value) => {
    setMealReminderSwitch(value);
    setShowMealOptions(value);

    if (!value) {
      Notifications.cancelAllScheduledNotificationsAsync();
    } else {
      handleScheduleNotification();
    }
  };

  const renderMealOptions = () => {
    const pickerStyle =
    Platform.OS === "ios" ? styles.iosPicker : styles.androidPicker;
    return (
      <View style={styles.mealOptionsContainer}>
        {["breakfast", "lunch", "dinner"].map((meal) => (
          <View key={meal} style={styles.mealOption}>
            <Text style={[styles.mealLabel, { color: theme.color }]}>
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </Text>
            <View style={[pickerStyle, {backgroundColor: "#59d3ff"}]}>
              <DateTimePicker
                value={mealReminders[meal] || new Date()}
                mode="time"
                is24Hour={true}
                display="clock"
                onChange={(event, selectedDate) =>
                  handleTimeChange(event, selectedDate, meal)
                }
              />
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.btnBackgroundColor },
          ]}
          onPress={handleSaveMealTime}
        >
          <Text style={[styles.saveButtonText, { color: theme.btncolor }]}>
            Save Meal Times
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Text style={[styles.heading, { color: theme.color }]}>Settings</Text>

      <View style={styles.setting}>
        <Text style={[styles.label, { color: theme.color }]}>
          Set Meal Reminder
        </Text>
        <Switch
          value={mealReminderSwitch}
          onValueChange={handleToggleMealOptions}
          trackColor={{ false: "#767577", true: "#FF8559" }}
          thumbColor={mealReminderSwitch ? "#9E2A00" : "#f4f3f4"}
        />
      </View>

      {showMealOptions && renderMealOptions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
  },
  mealOptionsContainer: {
    marginTop: 20,
  },
  mealOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mealLabel: {
    fontSize: 16,
    marginRight: 20,
  },
  saveButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  iosPicker: {
    borderRadius: 10,
    width: 70,
  },
  androidPicker: {
    backgroundColor: '#fff',
    color: '#000',
  },
});

export default AppSettings;
