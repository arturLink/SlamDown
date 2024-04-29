import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getUserMoney, setUserMoney } from '../Utils/Money.js';
import { useFocusEffect } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons'; //AttachMoney

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
      <Text style={{ fontSize: 24, fontWeight: 'bold', color:'#ffc61a' }}>{userMoney}<MaterialIcons name={'attach-money'} size={24} color='#ffffff' /></Text>
    </View>
  );
};

export default MoneyDisplay;
