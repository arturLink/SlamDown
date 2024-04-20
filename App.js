import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FightPage from './Screens/FightPage';
import StorePage from './Screens/StorePage';
import RosterPage from './Screens/RosterPage';

const Tab = createBottomTabNavigator();

const App = () => {
  const [roster, setRoster] = useState([]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Fight" component={FightPage} />
          <Tab.Screen name="Store" component={StorePage} />
          <Tab.Screen name="Your Roster" component={RosterPage} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
