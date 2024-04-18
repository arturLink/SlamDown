import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';

const StorePage = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
        <Text style={styles.text}>Hello, StorePage!</Text>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default StorePage;
