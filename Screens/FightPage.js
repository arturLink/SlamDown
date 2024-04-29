import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUserMoney, setUserMoney } from '../Utils/Money.js';

const FightPage = () => {
  const [randomWrestler, setRandomWrestler] = useState(null);
  const [userSelectedWrestler, setUserSelectedWrestler] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fightResult, setFightResult] = useState(null);
  const [roster, setRoster] = useState([]);
  const [AllWrestlers, setAllWrestlers] = useState([]);
  const [noCardsModalVisible, setNoCardsModalVisible] = useState(false);

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

        if (storedRoster.length === 0) {
          // If the user has no cards, give them a random one and open the modal
          assignRandomCardToUser();
          setNoCardsModalVisible(true);
        }
      } else {
        assignRandomCardToUser(); // Assign a card if there's nothing in AsyncStorage
        setNoCardsModalVisible(true);
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
      await AsyncStorage.removeItem('store', JSON.stringify([randomCard]));      
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
      setFightResult(randomWrestler.Name + ' wins!');
      const additionalMoney = 50;
      await setUserMoney(userMoney + additionalMoney);
    } else {
      setFightResult(userSelectedWrestler.Name + ' wins!');
      const additionalMoney = 200;
      await setUserMoney(userMoney + additionalMoney);
    }
  };

  const replay = () => {
    setRandomWrestler(getRandomWrestler(AllWrestlers)); // New random wrestler for the fight
    setUserSelectedWrestler(null); // Reset user-selected wrestler
    setFightResult(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {randomWrestler && (
            <View style={styles.wrestlerContainer}>
              <Image
                source={randomWrestler.Picture}
                style={styles.image}
              />
              <View>
                <Text>{randomWrestler.Name}</Text>
                <Text>Attack: {randomWrestler.Damage}</Text>
                <Text>Defence: {randomWrestler.Defence}</Text>
                <Text>Health: {randomWrestler.Health}</Text>
              </View>
            </View>
          )}
          {!randomWrestler && <Text>Loading random wrestler...</Text>}
        </View>
        
        <View style={styles.rowContainer}>
          {userSelectedWrestler && (
            <View style={styles.wrestlerContainer}>
              <Image
                source={userSelectedWrestler.Picture}
                style={styles.image}
              />
              <View>
                <Text>{userSelectedWrestler.Name}</Text>
                <Text>Attack: {userSelectedWrestler.Damage}</Text>
                <Text>Defence: {userSelectedWrestler.Defence}</Text>
                <Text>Health: {userSelectedWrestler.Health}</Text>
              </View>
            </View>
          )}
          {!userSelectedWrestler && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#28a745' }]}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>Select Wrestler</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: roster.length > 0 ? '#007bff' : 'gray' }]}
          disabled={roster.length === 0}
          onPress={determineWinner}>
          <Text style={styles.buttonText}>Fight!</Text>
        </TouchableOpacity>
        
        {fightResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{fightResult}</Text>
            <TouchableOpacity style={styles.button} onPress={replay}>
              <Text style={styles.buttonText}>Replay</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={roster}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => selectUserWrestler(item)}>
                    <Text>{item.Name}</Text>
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

        <Modal
          visible={noCardsModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setNoCardsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>You need at least one card to fight.</Text>
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  wrestlerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalItemImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default FightPage;