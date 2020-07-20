import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
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

  useEffect(() => {
    if (!isFocused) return;
    // if (HomeScreen.isFocused === props.isFocused) {
    //   return;
    // }
    firebase
      .firestore()
      .collection('RoomMemberJunction')
      .where('userId', '==', userID)
      .get()
      .then((querySnapshot) => {
        const gameRoomIds = querySnapshot.docs.map(
          (doc) => doc.data().gameRoomId,
        );
        console.log('roomIds', gameRoomIds);
        firebase
          .firestore()
          .collection('gameRooms')
          .where('id', 'in', gameRoomIds)
          .get()
          .then((snapshot) => {
            // console.log('snapshot', snapshot.data());
            const gameRoomsData = snapshot.docs.map((document) => {
              console.log(document.data());
              return document.data();
            });
            setGameRoomData(gameRoomsData);
          });
      });
  }, [userID, isFocused]);
  // const [myGameRoom, setMyGameRoom] = useState([]);
  // const onGameRoomPress = (item) => {
  //   alert('haha');
  //   navigation.navigate('GameRoom', { gameRoom: item });
  // console.log('items Data', item);
  // };

  const logOutPress = () => {
    firebase.auth().signOut();
    // navigation.navigate(''); // <== This will signout from firebase
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.firstBox}> */}
      <Text style={styles.headline}>Welcome {userFullName}</Text>
      {/* </View> */}
      <View style={styles.firstBox}>
        <Text style={styles.buttonText}>Here can be your ad</Text>
      </View>
      <Text style={styles.headline}>Your Game Rooms:</Text>
      <View style={styles.gameRooms}>
        {/* <GameRooms userID={userID} /> */}

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
          onPress={() => navigation.navigate('NewRoom')}
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
