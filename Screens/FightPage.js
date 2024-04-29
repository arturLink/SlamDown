import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUserMoney, setUserMoney } from '../Utils/Money.js';

const FightPage = () => {
  const [randomWrestler, setRandomWrestler] = useState(null);
  const [userSelectedWrestler, setUserSelectedWrestler] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fightResultModalVisible, setFightResultModalVisible] = useState(false);
  const [fightResult, setFightResult] = useState(null);
  const [fightOutcomeMessage, setFightOutcomeMessage] = useState('');
  const [roster, setRoster] = useState([]);
  const [AllWrestlers, setAllWrestlers] = useState([]);
  const [noCardsModalVisible, setNoCardsModalVisible] = useState(false);
  const [moneyEarned, setMoneyEarned] = useState(0);

  const navigation = useNavigation(); // To navigate to other pages

  useEffect(() => {
    loadRoster();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadRoster();
    }, [])
  );

  const loadRoster = async () => {
    try {
      const jsonValueR = await AsyncStorage.getItem('roster');
      if (jsonValueR !== null) {
        const storedRoster = JSON.parse(jsonValueR);
        setRoster(storedRoster); 
      }

      const jsonValueW = await AsyncStorage.getItem('allWrestlers');
      if (jsonValueW !== null) {
        const storedWrestlers = JSON.parse(jsonValueW);
        setAllWrestlers(storedWrestlers);
        setRandomWrestler(getRandomWrestler(storedWrestlers)); // Choose a random wrestler to fight
      }
    } catch (error) {
      console.error('Failed to load data from AsyncStorage:', error);
    }
  };

  const assignRandomCardToUser = async () => {
    const randomCard = getRandomWrestler(AllWrestlers);
    if (randomCard) {
      setRoster([randomCard]);
      await AsyncStorage.setItem('roster', JSON.stringify([randomCard]));    
    }
  };

  const getRandomWrestler = (wrestlers) => {
    const randomIndex = Math.floor(Math.random() * wrestlers.length);
    return wrestlers[randomIndex];
  };

  const selectUserWrestler = (wrestler) => {
    setUserSelectedWrestler(wrestler);
    setModalVisible(false);
  };

  const determineWinner = async () => {
    if (roster.length === 0) {
      setNoCardsModalVisible(true);
      return;
    }

    if (!randomWrestler || !userSelectedWrestler) {
      setFightResult('Fight cannot proceed. Select wrestlers first.');
      return;
    }
    const userMoney = await getUserMoney();

    const totalStats1 = randomWrestler.Damage + randomWrestler.Defence + randomWrestler.Health;
    const totalStats2 = userSelectedWrestler.Damage + randomWrestler.Defence + userSelectedWrestler.Health;
    const probability1 = totalStats1 / (totalStats1 + totalStats2);
    const randomNumber = Math.random();

    if (randomNumber <= probability1) {
      setFightResult(randomWrestler);
      setFightOutcomeMessage(`${randomWrestler.Name} Defeated you!`);
      const additionalMoney = 50;
      await setUserMoney(userMoney + additionalMoney);
      setMoneyEarned(50);
      setFightResultModalVisible(true);
    } else {
      setFightResult(userSelectedWrestler);
      setFightOutcomeMessage(`${userSelectedWrestler.Name} wins! Congratulations!`);
      const additionalMoney = 200;
      await setUserMoney(userMoney + additionalMoney);
      setMoneyEarned(200);
      setFightResultModalVisible(true);
    }

    setRandomWrestler(getRandomWrestler(AllWrestlers));
    setUserSelectedWrestler(null);
    // setFightResult(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Wrestler Selection */}
        <View style={styles.rowContainer}>
          {randomWrestler ? (
            <View style={styles.wrestlerContainer}>
              <Image
                source={randomWrestler.Picture}
                style={styles.image}
              />
              <View>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 22, marginTop: 30 }}>{randomWrestler.Name}</Text>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 30, marginBottom: 12 }}> <Image style={styles.StatImage} source={require('../assets/Icons/battle.png')}/>  {randomWrestler.Damage}</Text>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 30, marginBottom: 12 }}> <Image style={styles.StatImage} source={require('../assets/Icons/shield.png')}/> {randomWrestler.Defence}</Text>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 30, marginBottom: 12 }}> <Image style={styles.StatImage} source={require('../assets/Icons/heart.png')}/> {randomWrestler.Health}</Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: '#ffffff' }}>Loading random wrestler...</Text>
          )}
        </View>
        
        {/* User Wrestler Selection */}
        <View style={styles.rowContainer}>
          {userSelectedWrestler ? (
            <View style={styles.wrestlerContainer}>
              <Image
                source={userSelectedWrestler.Picture}
                style={styles.image}
              />
              <View>
              <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 22, marginTop: 30 }}>{userSelectedWrestler.Name}</Text>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 30, marginBottom: 12 }}> <Image style={styles.StatImage} source={require('../assets/Icons/battle.png')}/>  {userSelectedWrestler.Damage}</Text>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 30, marginBottom: 12 }}> <Image style={styles.StatImage} source={require('../assets/Icons/shield.png')}/> {userSelectedWrestler.Defence}</Text>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 30, marginBottom: 12 }}> <Image style={styles.StatImage} source={require('../assets/Icons/heart.png')}/> {userSelectedWrestler.Health}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.wrestlerContainer}>
              <Image
                source={require('../assets/Icons/question-sign.png')}
                style={styles.image}
              />
              <View>
              <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 22, marginTop: 30 }}>Wrestler not selected</Text>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 30, marginBottom: 12 }}> <Image style={styles.StatImage} source={require('../assets/Icons/battle.png')}/>  ???</Text>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 30, marginBottom: 12 }}> <Image style={styles.StatImage} source={require('../assets/Icons/shield.png')}/> ???</Text>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 30, marginBottom: 12 }}> <Image style={styles.StatImage} source={require('../assets/Icons/heart.png')}/> ???</Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity
              style={styles.buttonSelect} // Gray for button when no wrestler is selected
              disabled={roster.length === 0}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>Select Wrestler</Text>
            </TouchableOpacity>

        {/* Fight Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: roster.length > 0 ? '#ffc61a' : '#808080' }]}
          disabled={roster.length === 0}
          onPress={determineWinner}>
          <Text style={styles.buttonText}>Fight!</Text>
        </TouchableOpacity>
        
        {/* Modal for Selecting Wrestlers */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={roster}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => selectUserWrestler(item)}>
                    <Text style={{ color: '#ffffff' }}>{item.Name}</Text>
                    <Image
                      source={item.Picture}
                      style={styles.modalItemImage}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Modal for No Cards */}
        <Modal
          visible={noCardsModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setNoCardsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{ color: '#ffffff' }}>You need at least one card to fight.</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  assignRandomCardToUser();
                  setNoCardsModalVisible(false);
                  navigation.navigate('Your Roster');
                }}>
                <Text style={styles.buttonText}>Get a Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Fight Result Modal */}
        <Modal
          animationType="slide"
          transparent
          visible={fightResultModalVisible}
          onRequestClose={() => setFightResultModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalMessage}>{fightOutcomeMessage}</Text>
              <Text style={{ fontSize: 18, color: '#ffffff' }}>Money earned: {moneyEarned}$</Text>
              {fightResult && (
                <Image source={fightResult.Picture} style={styles.resultImage} />
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setFightResultModalVisible(false);
                  setFightOutcomeMessage(''); // Clear the message
                }}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303030', // Background color for the main container
  },
  resultImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: 'contain', // To ensure the image is displayed properly
  },
  modalMessage: {
    fontSize: 18,
    color: '#ffffff', // White text for the message
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  wrestlerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginTop: 50,
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#ffc61a', // Button color
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonSelect: {
    backgroundColor: '#808080', // Button color
    padding: 10,
    borderRadius: 8,
    marginTop: 36,
  },
  buttonText: {
    color: '#ffffff', // White text on buttons
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
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
    alignItems: 'center',
  },
  modalItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalItemImage: {
    width: 140,
    height: 140,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  resultContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#ffffff', // White text for result
  },
  StatImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  }
});

export default FightPage;