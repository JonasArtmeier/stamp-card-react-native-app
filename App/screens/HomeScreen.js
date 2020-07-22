import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  BackHandler,
  Image,
} from 'react-native';
import { firebase } from '../../src/firebase/config';
// import { useScreens } from 'react-native-screens';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Footer from '../components/Footer';

export default function HomeScreen(props) {
  const isFocused = useIsFocused();
  const userFullName = props.extraData.fullName;
  const navigation = useNavigation();
  const userID = props.extraData.id;
  const [gameRoomData, setGameRoomData] = useState([]);
  const [myGameRoomIds, setMyGameRoomIds] = useState('');

  useEffect(() => {
    if (!isFocused) return;

    firebase
      .firestore()
      .collection('RoomMemberJunction')
      .where('userId', '==', userID)
      .get()
      .then((querySnapshot) => {
        const gameRoomIds = querySnapshot.docs.map(
          (doc) => doc.data().gameRoomId,
        );
        setMyGameRoomIds(gameRoomIds);
        firebase
          .firestore()
          .collection('gameRooms')
          .where('id', 'in', gameRoomIds)
          .get()
          .then((snapshot) => {
            const gameRoomsData = snapshot.docs.map((document) => {
              return document.data();
            });
            setGameRoomData(gameRoomsData);
          });
      });
  }, [userID, isFocused]);

  const logOutPress = async () => {
    await firebase.auth().signOut().then(BackHandler.exitApp());
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Welcome {userFullName}</Text>

      <Image style={styles.logo} source={require('../assets/logo.png')} />

      <Text style={styles.headline}>Your Game Rooms:</Text>
      <View style={styles.gameRooms}>
        <FlatList
          data={gameRoomData}
          renderItem={({ item, index }) => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}
            >
              {gameRoomData !== undefined ? (
                <Text
                  style={styles.flatListText}
                  onPress={() =>
                    navigation.navigate('GameRoom', {
                      myGameRoom: item,
                    })
                  }
                >
                  {item.name}
                </Text>
              ) : (
                <Text style={styles.flatListText}>No Game Room</Text>
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.formContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            myGameRoomIds.length > 9
              ? alert('You can not have mor than 10 Game Rooms')
              : navigation.navigate('NewRoom');
          }}
        >
          <Text style={styles.buttonText}>Create New Game Room</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => logOutPress()}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}

/// styles ///
const styles = StyleSheet.create({
  container: {
    zIndex: -1,
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    flex: 1,
    width: 140,
    alignSelf: 'center',
  },
  headline: {
    marginTop: 20,
    height: 48,
    fontSize: 20,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  firstBox: {
    alignItems: 'center',
    backgroundColor: 'deepskyblue',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  gameRooms: {
    flex: 2,
    alignItems: 'center',
    backgroundColor: 'azure',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  button: {
    backgroundColor: 'deepskyblue',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 40,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: 30,
    marginRight: 30,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatListText: {
    marginLeft: 30,
    marginRight: 30,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    borderStyle: 'dashed',
  },
});
