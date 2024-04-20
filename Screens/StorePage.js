// StorePage.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorePage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [roster, setRoster] = useState([]);
  const [store, setStore] = useState([]);

  useEffect(() => {
    // Load roster and store data from AsyncStorage
    loadRoster();
    loadStore();
  }, []);

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

  const handleBuy = async (card) => {
    // Add card to roster
    const newRoster = [...roster, card];
    setRoster(newRoster);
    saveRoster(newRoster);

    // Remove card from store
    const newStore = store.filter((item) => item !== card);
    setStore(newStore);
    saveStore(newStore);
  };

  const saveStore = async (newStore) => {
    try {
      await AsyncStorage.setItem('store', JSON.stringify(newStore));
    } catch (error) {
      console.error('Failed to save store to AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      {store.map((card, index) => (
        <TouchableOpacity key={index} style={styles.cardContainer} onPress={() => handleCardPress(card)}>
          <Image
            source={card.Picture}
            style={styles.cardImage}
          />
          <Text>{card.Name}</Text>
          <Text>Price: {card.Price}</Text>
        </TouchableOpacity>
      ))}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          {selectedCard && (
            <View style={styles.modalContent}>
              <Image
                source={selectedCard.Picture}
                style={styles.modalImage}
              />
              <Text>Name: {selectedCard.Name}</Text>
              <Text>Damage: {selectedCard.Damage}</Text>
              <Text>Defense: {selectedCard.Defence}</Text>
              <Text>Health: {selectedCard.Health}</Text>
              <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(selectedCard)}>
                <Text style={styles.buyButtonText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buyButtonText: {
    color: 'white',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default StorePage;