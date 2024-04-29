import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUserMoney, setUserMoney } from '../Utils/Money.js';
import { MaterialIcons } from '@expo/vector-icons';

const StorePage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [roster, setRoster] = useState([]);
  const [store, setStore] = useState([]);
  const [userMoney, setUserMoneyState] = useState(0);

  useEffect(() => {
    loadRoster();
    loadStore();
    loadUserMoney();
  }, []);

  const loadUserMoney = async () => {
    const money = await getUserMoney();
    setUserMoneyState(money);
  };

  const loadRoster = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('roster');
      if (jsonValue !== null) {
        setRoster(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error('Failed to load roster from AsyncStorage:', error);
    }
  };

  const addCardToRoster = async (card) => {
    try {
      // Retrieve the current roster from AsyncStorage
      const jsonValue = await AsyncStorage.getItem('roster');
      let roster = jsonValue ? JSON.parse(jsonValue) : [];
  
      // Check if the card already exists in the roster to avoid duplicates
      const cardExists = roster.some((existingCard) => existingCard.Name === card.Name);
  
      if (!cardExists) {
        // If card doesn't exist, add it to the roster
        roster.push(card);
  
        // Update the roster in AsyncStorage
        const updatedJsonValue = JSON.stringify(roster);
        await AsyncStorage.setItem('roster', updatedJsonValue);
  
        console.log(`Card ${card.Name} added to roster.`);
      } else {
        console.log(`Card ${card.Name} already in roster.`);
      }
    } catch (error) {
      console.error('Error adding card to roster:', error);
    }
  };

  const loadStore = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('store');
      if (jsonValue !== null) {
        setStore(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error('Failed to load store from AsyncStorage:', error);
    }
  };

  const saveRoster = async (newRoster) => {
    try {
      await AsyncStorage.setItem('roster', JSON.stringify(newRoster));
    } catch (error) {
      console.error('Failed to save roster to AsyncStorage:', error);
    }
  };

  const handleCardPress = (card) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const StatRow = ({ imageSource, statText }) => (
    <View style={styles.statRow}>
      <Image style={styles.StatImage} source={imageSource} />
      <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 24, marginTop: 30 }}>{statText}</Text>
    </View>
  );

  const handleBuy = async (card) => {
    const cardCost = card.Price;
    const currentMoney = await getUserMoney();
    const ownsCard = roster.some((rosterCard) => rosterCard.Name === card.Name);

    if (currentMoney >= cardCost && !ownsCard) {
      await setUserMoney(currentMoney - cardCost);
      setUserMoneyState(currentMoney - cardCost);
      addCardToRoster(card);
      const newRoster = [...roster, card];
      setRoster(newRoster);
      saveRoster(newRoster);
      setModalMessage(`Congratulations! You purchased ${card.Name}!`);
      setWarningModalVisible(true);
    } else if (currentMoney < cardCost) {
      setModalMessage(`Not enough money to buy ${card.Name}.`);
      setWarningModalVisible(true);
    } else if (ownsCard) {
      setModalMessage(`You already own ${card.Name}.`);
      setWarningModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={store}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => handleCardPress(item)}
          >
            <Image source={item.Picture} style={styles.cardImage} />
            <Text style={styles.cardText}>{item.Name}</Text>
            <Text style={styles.cardPrice}>Price: {item.Price}$</Text>
          </TouchableOpacity>
        )}
        numColumns={2}
        columnWrapperStyle={styles.rowContainer}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedCard && (
            <View style={styles.modalContent}>
              <Image source={selectedCard.Picture} style={styles.modalImage} />
              <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 22, marginTop: 30, justifyContent: 'center', alignContent: 'center' }}>{selectedCard.Name}</Text>
              <View style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                <StatRow imageSource={require('../assets/Icons/battle.png')} statText={selectedCard.Damage} />
                <StatRow imageSource={require('../assets/Icons/shield.png')} statText={selectedCard.Defence} />
                <StatRow imageSource={require('../assets/Icons/heart.png')} statText={selectedCard.Health} />
              </View>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuy(selectedCard)}
              >
                <Text style={styles.buyButtonText}>Buy{"\n"}{selectedCard.Price}$</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={warningModalVisible}
        onRequestClose={() => setWarningModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalWarning}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setWarningModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#303030', // Dark gray background
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //paddingVertical: 10,
  },
  StatImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 30,
    // position : 'absolute',
    //resizeMode: 'contain',
  },
  rowContainer: {
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  rowContainer: {
    justifyContent: 'space-around', // Space evenly between cards
    marginBottom: 20,
  },
  cardContainer: {
    alignItems: 'center',
    backgroundColor: '#808080', // Light gray for card background
    padding: 15,
    borderRadius: 10,
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain', // Ensure image fits
  },
  cardText: {
    color: '#ffffff', // White text for card names
    fontWeight: 'bold', 
  },
  cardPrice: {
    color: '#ffc61a', // Yellow for price
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent dark background for modals
  },
  modalContent: {
    backgroundColor: '#808080', // Light gray for modal content
    padding: 20,
    borderRadius: 10,
    alignItems: 'center', // Center content in modal
  },
  modalImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain', // Ensure image fits
  },
  buyButton: {
    backgroundColor: '#ffc61a', // Yellow for upgrade button
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'stretch',
  },
  buyButtonText: {
    color: '#303030', // White text for upgrade button
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold', 
  },
  closeButton: {
    backgroundColor: '#808080',
    borderColor: '#ffffff',
    alignSelf: 'stretch',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#ffffff', // White text on close button
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalWarning: {
    color: '#ffffff', // White text for warning message
    textAlign: 'center', 
  },
});

export default StorePage;
