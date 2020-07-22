import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { firebase } from '../../src/firebase/config';
import Spacer from '../components/Spacer';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import GameRooms from '../components/GameRooms';

export default function GameRoomScreen(props) {
  const isFocused = useIsFocused();

  /// Get the Question Data ///

  useEffect(() => {
    if (!isFocused) return;
    firebase
      .firestore()
      .collection('QuestionRoomJunction')
      .where('gameRoomId', '==', props.route.params.myGameRoom.id)
      .get()
      .then((querySnapshot) => {
        const questionIds = querySnapshot.docs.map(
          (doc) => doc.data().questionId,
        );
        firebase
          .firestore()
          .collection('questions')
          .where('id', 'in', questionIds)
          .get()
          .then((snapshot) => {
            const questionsData = snapshot.docs.map((document) =>
              document.data(),
            );

            setQuestionData(questionsData);
          });
      });
  }, [props.route.params.myGameRoom.id, isFocused]);

  const [questionData, setQuestionData] = useState([]);
  const userFullName = props.extraData.fullName;
  const navigation = useNavigation();
  const userID = props.extraData.id;
  const myGameRoom = props.route.params.myGameRoom;

  /// Only delete the entry in the junction table ///
  const leaveRoom = () => {
    firebase
      .firestore()
      .collection('RoomMemberJunction')
      .where('gameRoomId', '==', props.route.params.myGameRoom.id)
      .where('userId', '==', userID)
      .get()
      .then((snapshot) => {
        const junctionId = snapshot.docs.map((doc) => doc.data().id);
        firebase
          .firestore()
          .collection('RoomMemberJunction')
          .doc(junctionId[0])
          .delete();
        alert('Room left');
        navigation.navigate('Home');
      });
  };

  /// Delete the Room and all junction entries ///

  const deleteRoom = () => {
    firebase
      .firestore()
      .collection('RoomMemberJunction')
      .where('gameRoomId', '==', props.route.params.myGameRoom.id)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => doc.ref.delete());
      });
    firebase
      .firestore()
      .collection('gameRooms')
      .doc(props.route.params.myGameRoom.id)
      .delete()
      .then(() => {
        alert('Room deleted');
        navigation.navigate('Home');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>{myGameRoom.name}</Text>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <Text style={styles.headline}>The Questions</Text>

      <View style={styles.gameRooms}>
        <FlatList
          data={questionData}
          renderItem={({ item, index }) => (
            <View
              style={{
                width: 300,
                borderTopWidth: 1,
                borderColor: '#CED0CE',
                flex: 1,
                alignItems: 'center',
                paddingVertical: 20,
              }}
            >
              {questionData !== undefined ? (
                <Text
                  style={styles.flatListText}
                  onPress={() =>
                    navigation.navigate('Question', {
                      questionData: item,
                    })
                  }
                >
                  {item.question}
                </Text>
              ) : (
                <Text style={styles.flatListText}>No Question</Text>
              )}
            </View>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Invite', {
            myGameRoom: myGameRoom,
          })
        }
      >
        <Text style={styles.buttonText}>Invite a Friend</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('NewQuestion', {
            myGameRoom: myGameRoom,
          })
        }
      >
        <Text style={styles.buttonText}>Create a Question</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          userID === myGameRoom.creator ? deleteRoom() : leaveRoom();
        }}
      >
        <Text style={styles.buttonText}>Delete Room</Text>
      </TouchableOpacity>
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
    marginTop: 20,
    marginBottom: 10,
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
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    borderStyle: 'dashed',
  },
});
