const CaloriesCalculator = {
    calculateBMR: (age, gender, height, weight) => {
      let bmr;
  
      if (gender === 'male') {
        bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
      } else {
        bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
      }
  
      return bmr;
    },
  
    calculateTotalCalories: (bmr, activityLevel) => {
      const activityFactors = {
        sedentary: 1.2,
        lightlyActive: 1.375,
        moderatelyActive: 1.55,
        veryActive: 1.725,
      };
  
      return Math.round(bmr * activityFactors[activityLevel]);
    },
  };
  
  export default CaloriesCalculator;
  