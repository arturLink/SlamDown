import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';

const FightPage = () => {
  const [randomWrestler, setRandomWrestler] = useState(null);
  const [userSelectedWrestler, setUserSelectedWrestler] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fightResult, setFightResult] = useState(null);

  useEffect(() => {
    setRandomWrestler(getRandomWrestler());
  }, []);

  const getRandomWrestler = () => {
    const randomIndex = Math.floor(Math.random() * initialCardData.length);
    return initialCardData[randomIndex];
  };

  const selectUserWrestler = (wrestler) => {
    setUserSelectedWrestler(wrestler);
    setModalVisible(false);
  };

  const determineWinner = () => {
    if (!randomWrestler || !userSelectedWrestler) {
      setFightResult('Fight cannot proceed. Select wrestlers first.');
      return;
    }

    const totalStats1 = randomWrestler.Damage + randomWrestler.Defence + randomWrestler.Health;
    const totalStats2 = userSelectedWrestler.Damage + userSelectedWrestler.Defence + userSelectedWrestler.Health;
    const probability1 = totalStats1 / (totalStats1 + totalStats2);
    const randomNumber = Math.random();

    if (randomNumber <= probability1) {
      setFightResult(randomWrestler.Name + ' wins!');
    } else {
      setFightResult(userSelectedWrestler.Name + ' wins!');
    }
  };

  const replay = () => {
    setRandomWrestler(getRandomWrestler());
    setUserSelectedWrestler(null);
    setFightResult(null);
  };

  const initialCardData = [
    {
      Name: 'Artur Arder',
      Damage: 75,
      Defence: 78,
      Health: 76,
      Ability: 'Ability 1',
      Price: 1000,
      Picture: require('../assets/Wrestlers/ArturArder.png')
    },
    {
      Name: 'Starbuck',
      Damage: 96,
      Defence: 96,
      Health: 96,
      Ability: 'Ability 2',
      Price: 3000,
      Picture: require('../assets/Wrestlers/Starbuck.png')
    },
    {
        Name: 'TT Suosalo',
        Damage: 84,
        Defence: 88,
        Health: 82,
        Ability: 'Ability 2',
        Price: 2000,
        Picture: require('../assets/Wrestlers/TTSuosalo.png')
      },
      {
        Name: 'Dylan Broda',
        Damage: 88,
        Defence: 84,
        Health: 82,
        Ability: 'Ability 2',
        Price: 2000,
        Picture: require('../assets/Wrestlers/DylanBroda.png')
      },
      {
        Name: 'Dr. No!',
        Damage: 70,
        Defence: 70,
        Health: 72,
        Ability: 'Ability 2',
        Price: 1000,
        Picture: require('../assets/Wrestlers/DrNo.png')
      },
      {
        Name: 'Dr. Sadism',
        Damage: 78,
        Defence: 78,
        Health: 78,
        Ability: 'Ability 2',
        Price: 1000,
        Picture: require('../assets/Wrestlers/DrSadism.png')
      },
      {
        Name: 'Eemi Helen',
        Damage: 78,
        Defence: 70,
        Health: 74,
        Ability: 'Ability 2',
        Price: 1000,
        Picture: require('../assets/Wrestlers/EemiHelen.png')
      },
      {
        Name: 'El Miguel',
        Damage: 70,
        Defence: 70,
        Health: 74,
        Ability: 'Ability 2',
        Price: 1000,
        Picture: require('../assets/Wrestlers/ElMiguel.png')
      },
      {
        Name: 'Johhny McMetal',
        Damage: 88,
        Defence: 82,
        Health: 86,
        Ability: 'Ability 2',
        Price: 2000,
        Picture: require('../assets/Wrestlers/JohnnyMcMetal.png')
      },
      {
        Name: 'Kosmo The Evil Clown',
        Damage: 74,
        Defence: 70,
        Health: 78,
        Ability: 'Ability 2',
        Price: 1000,
        Picture: require('../assets/Wrestlers/Kosmo.png')
      },
      {
        Name: 'Miika Forsström',
        Damage: 78,
        Defence: 78,
        Health: 70,
        Ability: 'Ability 2',
        Price: 1000,
        Picture: require('../assets/Wrestlers/MiikaForsström.png')
      },
      {
        Name: 'Mikk Vainula',
        Damage: 88,
        Defence: 84,
        Health: 88,
        Ability: 'Ability 2',
        Price: 2000,
        Picture: require('../assets/Wrestlers/MikkVainula.png')
      },
      {
        Name: 'Nick Lukkonen',
        Damage: 70,
        Defence: 74,
        Health: 76,
        Ability: 'Ability 2',
        Price: 1000,
        Picture: require('../assets/Wrestlers/NickLukkonen.png')
      },
      {
        Name: 'Stark Adder',
        Damage: 92,
        Defence: 98,
        Health: 90,
        Ability: 'Ability 2',
        Price: 3000,
        Picture: require('../assets/Wrestlers/StarkAdder.png')
      },
  ];

  return (
    
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
        <TouchableOpacity style={styles.button} onPress={determineWinner}>
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
                data={initialCardData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => selectUserWrestler(item)}>
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
