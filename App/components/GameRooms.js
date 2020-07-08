import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { firebase } from '../../src/firebase/config';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

//// style-components ////
const styles = StyleSheet.create({
  inputField: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
});

//// function ////
export default function GameRooms(props) {
  const navigation = useNavigation();
  // const [gameRoomData, setGameRoomData] = useState([]);

  // useEffect(() => {
  //   firebase
  //     .firestore()
  //     .collection('RoomMemberJunction')
  //     .where('userId', '==', props.userID)
  //     .get()
  //     .then((querySnapshot) => {
  //       const gameRoomIds = querySnapshot.docs.map(
  //         (doc) => doc.data().gameRoomId,
  //       );
  //       firebase
  //         .firestore()
  //         .collection('gameRooms')
  //         .where('id', 'in', gameRoomIds)
  //         .get()
  //         .then((snapshot) => {
  //           const gameRoomsData = snapshot.docs.map((document) => {
  //             return document.data();
  //           });
  //           setGameRoomData(gameRoomsData);
  //         });
  //     });
  // }, []);

  const gameRoomData = props.extraData1;
  const onGameRoomPress = () => {
    navigation.navigate('GameRoom', { gameRoom: gameRoomData });
  };
  console.log(props.extraData1);
  console.log(props.extraData);
  // console.log(
  //   'ready to use',
  //   gameRoomData.map((it) => it.name),
  // );
  // const gameRoomName = gameRoomData.map((it) => it.name);
  // setGameRoomName((value) => [...value, ...gameRoomData]);
  if (gameRoomData !== undefined) {
    return (
      <FlatList
        data={gameRoomData}
        renderItem={({ item }) => (
          <View
            style={{
              height: 50,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text onPress={onGameRoomPress}>Game Room: {item.name}</Text>
          </View>
        )}
      />
    );
  }
  return (
    <View>
      <Text>No GameRooms</Text>
    </View>
  );
}
