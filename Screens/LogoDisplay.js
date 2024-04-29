import React from 'react';
import { Image } from 'react-native';

const HeaderLogo = () => (
  <Image
    source={require('../assets/Icons/SlamLogo.png')}
    style={{ width: 110, height: 100, marginTop: 40, marginLeft: 20 }} 
    //resizeMode="contain" 
  />
);

export default HeaderLogo;
