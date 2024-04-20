// RosterPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const RosterPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    // Load roster data from AsyncStorage
    loadRoster();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Load roster data from AsyncStorage
      loadRoster();
    }, [])
  );

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

  const handleCardPress = (card) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {roster.map((card, index) => (
        <TouchableOpacity key={index} style={styles.cardContainer} onPress={() => handleCardPress(card)}>
          <Image
            source={card.Picture}
            style={styles.cardImage}
          />
          <Text>{card.Name}</Text>
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

export default RosterPage;
