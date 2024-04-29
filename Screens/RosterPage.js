import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, FlatList } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';

import { getUserMoney, setUserMoney } from '../Utils/Money.js';

const RosterPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [userMoney, setUserMoneyState] = useState(0);
  const [roster, setRoster] = useState([]);


  useEffect(() => {
    loadRoster();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadRoster();
    }, [])
  );

  const addUpgradeLevelToRoster = (roster) => {
    return roster.map((card) => {
      if (card.upgradeLevel === undefined) {
        return { ...card, upgradeLevel: 0 };
      }
      return card;
    });
  };

  const loadRoster = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('roster');
      if (jsonValue !== null) {
        setRoster(addUpgradeLevelToRoster(JSON.parse(jsonValue)));
      }
    } catch (error) {
      console.error('Failed to load roster from AsyncStorage:', error);
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

  const handleUpgrade = async () => {
    const userMoney = await getUserMoney();
    const upgradeCost = selectedCard.Price / 2;
    if (userMoney >= upgradeCost) {
      if (selectedCard && selectedCard.upgradeLevel < 3) {
        const upgradedCard = {
          ...selectedCard,
          Damage: selectedCard.Damage + 2,
          Defence: selectedCard.Defence + 2,
          Health: selectedCard.Health + 2,
          upgradeLevel: (selectedCard.upgradeLevel || 0) + 1,
        };
  
        const updatedRoster = roster.map((card) =>
          card.Name === selectedCard.Name ? upgradedCard : card
        );
  
        setRoster(updatedRoster);
        await AsyncStorage.setItem('roster', JSON.stringify(updatedRoster));
        await setUserMoney(userMoney - upgradeCost);
  
        setSelectedCard(upgradedCard);
        setModalMessage(`Card has been upgraded.`);
        setWarningModalVisible(true);
      } else {
        setModalMessage(`This card has reached the maximum upgrade level.`);
        setWarningModalVisible(true);
      }
    } else {
      setModalMessage(`You do not have enough money to upgrade this card.`);
      setWarningModalVisible(true);
    }
  };

  const renderWrestler = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={() => handleCardPress(item)}>
      <Image source={item.Picture} style={styles.cardImage} />
      <Text>{item.Name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={roster}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => handleCardPress(item)}
          >
            <Image source={item.Picture} style={styles.cardImage} />
            <Text style={styles.cardText}>{item.Name}</Text>
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
              {selectedCard.upgradeLevel < 3 && (
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={handleUpgrade}
                >
                  <Text style={styles.upgradeButtonText}>
                    Upgrade{"\n"}{selectedCard.Price / 2}$
                  </Text>
                </TouchableOpacity>
              )}
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
  modalWarning: {
    color: '#ffffff', // White text for warning message
    textAlign: 'center', 
  },
  rowContainer: {
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  cardContainer: {
    alignItems: 'center',
    backgroundColor: '#808080', // Gray background for card containers
    padding: 15,
    borderRadius: 10,
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  cardText: {
    color: '#ffffff', // White text on cards
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent dark background for modals
  },
  modalContent: {
    backgroundColor: '#808080', // Gray background for modal content
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    alignItems: 'center'
  },
  modalImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    color: '#ffffff', // White text for modal
    textAlign: 'center',
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
  upgradeButton: {
    backgroundColor: '#ffc61a', // Yellow for upgrade button
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'stretch',
  },
  upgradeButtonText: {
    color: '#303030', // White text for upgrade button
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RosterPage;
