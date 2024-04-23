import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get user's money from AsyncStorage
export const getUserMoney = async () => {
  try {
    const value = await AsyncStorage.getItem('userMoney');
    return value ? parseInt(value, 10) : 0; // Default to 0 if not set
  } catch (error) {
    console.error('Error retrieving user money:', error);
    return 0; // Default to 0 in case of error
  }
};

// Function to set user's money in AsyncStorage
export const setUserMoney = async (money) => {
  try {
    await AsyncStorage.setItem('userMoney', money.toString());
  } catch (error) {
    console.error('Error setting user money:', error);
  }
};