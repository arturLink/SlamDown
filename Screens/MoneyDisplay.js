import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getUserMoney, setUserMoney } from '../Utils/Money.js';
import { useFocusEffect } from '@react-navigation/native';

// Component to display user's money
const MoneyDisplay = () => {
  const [userMoney, setUserMoney] = useState(0);

  // Fetch money on focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchMoney = async () => {
        const money = await getUserMoney();
        setUserMoney(money);
      };
      fetchMoney();
    }, [])
  );

  return (
    <View style={{ paddingRight: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>💰 {userMoney}</Text>
    </View>
  );
};

export default MoneyDisplay;
