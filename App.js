import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialCardData } from './Utils/Wrestlers.js';
import { getUserMoney, setUserMoney } from './Utils/Money.js';
import FightPage from './Screens/FightPage';
import StorePage from './Screens/StorePage';
import RosterPage from './Screens/RosterPage';
import MoneyDisplay from './Screens/MoneyDisplay.js';


const Tab = createBottomTabNavigator();

const App = () => {
  useEffect(() => {
    const checkAndInitializeWrestlers = async () => {
      try {
        const storedAllWrestlers = await AsyncStorage.getItem('allWrestlers');
        const storedStoreWrestlers = await AsyncStorage.getItem('store');
        const userMoney = await AsyncStorage.getItem('userMoney');
        if (storedAllWrestlers === null) {
          await AsyncStorage.setItem('allWrestlers', JSON.stringify(initialCardData));
        }
        else if (storedStoreWrestlers === null) {
          await AsyncStorage.setItem('store', JSON.stringify(initialCardData));
        }
        else if (userMoney === null) {
          await AsyncStorage.setItem('userMoney', '0');
        }
      } catch (error) {
        console.error('Error accessing AsyncStorage:', error);
      }
    };

    checkAndInitializeWrestlers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{
        headerRight: () => <MoneyDisplay />, // Add MoneyDisplay to header
        headerStyle: { backgroundColor: '#f8f8f8' }, // Customize as needed
        headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
      }}>
          <Tab.Screen name="Fight" component={FightPage} />
          <Tab.Screen name="Store" component={StorePage} />
          <Tab.Screen name="Your Roster" component={RosterPage} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;