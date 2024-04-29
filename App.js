import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialCardData } from './Utils/Wrestlers.js';
import { getUserMoney, setUserMoney } from './Utils/Money.js';

import FightPage from './Screens/FightPage';
import StorePage from './Screens/StorePage';
import RosterPage from './Screens/RosterPage';
import MoneyDisplay from './Screens/MoneyDisplay.js';
import HeaderDisplay from './Screens/LogoDisplay.js';

import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();


const checkAndInitializeWrestlers = async () => {
  try {
    const storedAllWrestlers = await AsyncStorage.getItem('allWrestlers');
    if (storedAllWrestlers === null) {
      await AsyncStorage.setItem('allWrestlers', JSON.stringify(initialCardData));
      await AsyncStorage.setItem('store', JSON.stringify(initialCardData));
      await AsyncStorage.setItem('userMoney', '0');
    }

    // Check if "roster" is set and if it's empty
    const storedRoster = await AsyncStorage.getItem('roster');
    if (storedRoster === null || JSON.parse(storedRoster).length === 0) {
      const randomWrestler = initialCardData[Math.floor(Math.random() * initialCardData.length)];
      await AsyncStorage.setItem('roster', JSON.stringify([randomWrestler]));
    } 
  } catch (error) {
    console.error('Error initializing wrestlers:', error);
  }
};

const App = () => {

  useEffect(() => {
    checkAndInitializeWrestlers();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
      <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            headerTitleAlign: 'left',
            headerTitle: () => <HeaderDisplay />,
            headerRight: () => <MoneyDisplay />,
            tabBarStyle: {
              backgroundColor: '#303030', // Dark gray background for the tab bar
            },
            tabBarActiveTintColor: '#ffc61a', // Yellow for active tabs
            tabBarInactiveTintColor: '#808080', // Gray for inactive tabs
            tabBarLabelStyle: {
              color: '#ffffff', // White for tab labels
              fontWeight: 'bold', // Make labels bold
              fontSize: 16, // Make labels smaller
            },
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Fight') {
                iconName = 'sports-mma';
              } else if (route.name === 'Store') {
                iconName = 'storefront';
              } else if (route.name === 'Your Roster') {
                iconName = 'people';
              }

              // Return the appropriate icon based on the tab
              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Fight" component={FightPage} />
          <Tab.Screen name="Store" component={StorePage} />
          <Tab.Screen name="Your Roster" component={RosterPage} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: '#303030',
  },
  headerTitle: {
    fontSize: 24, // Similar to CSS font-size
    fontWeight: 'bold', // Similar to CSS font-weight
    color: '#ffffff', // Similar to CSS color

  },
});

export default App;