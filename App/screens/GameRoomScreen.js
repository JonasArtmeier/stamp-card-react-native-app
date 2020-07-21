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
// import { useScreens } from 'react-native-screens';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import GameRooms from '../components/GameRooms';
// import myGameRoom from '../screens/HomeScreen';

export default function GameRoomScreen(props) {
  const isFocused = useIsFocused();
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
        // console.log('id', questionIds);
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
  console.log('final', questionData);
  const deleteRoom = () => {
    firebase
      .firestore()
      .collection('RoomMemberJunction')
      .where('gameRoomId', '==', props.route.params.myGameRoom.id)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => doc.ref.delete());
      });
    // .get()
    // .then((querySnapshot) => {
    //   const roomMemberJunctionIds = querySnapshot.docs.map((doc) => doc.id);
    //   const batch = firebase.firestore().batch();
    //   batch.set([roomMemberJunctionIds]);
    //   batch.delete([roomMemberJunctionIds]);
    //   batch.commit();
    // });

    // .then((response) => {
    //   const roomMemberJunctionIds = response.id;
    //   console.log(roomMemberJunctionIds);
    // .then((querySnapshot) => {
    //   var batch = firebase.batch();
    //   querySnapshot.forEach(function (doc) {
    //     batch.delete(doc.ref);
    //   });
    // })
    // .then(() => {
    //   console.log('Room deleted');

    // const roomMemberJunctionIds = querySnapshot.docs.map((doc) => doc.id);
    // console.log('test', roomMemberJunctionIds);
    // console.log('props', props.route.params.myGameRoom.id);
    // firebase
    //   .firestore()
    //   .collection('RoomMemberJunction')
    //   .doc(roomMemberJunctionIds)
    //   .delete();
    // .then(() => {
    //   alert('Room deleted');

    firebase
      .firestore()
      .collection('gameRooms')
      .doc(props.route.params.myGameRoom.id)
      .delete()
      .then(() => {
        alert('Room deleted');
        navigation.navigate('Home');
      });

    // <== This will signout from firebase
  };

  // console.log('extradata', props.route.params.myGameRoom.name);

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>{myGameRoom.name}</Text>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <Text style={styles.headline}>The Questions</Text>
      {/* <View style={styles.firstBox}>
        <Text>
          {' '}
          The next Question will be live at: {myGameRoom.questionStart}{' '}
        </Text>
      </View>
      <View style={styles.firstBox}>
        <Text>
          {' '}
          Please answer the Question until: {myGameRoom.questionEnd}{' '}
        </Text>
      </View>
      <View style={styles.firstBox}>
        <Text style={styles.buttonText}>test</Text>
      </View> */}
      <View style={styles.gameRooms}>
        <FlatList
          data={questionData}
          renderItem={({ item, index }) => (
            <View
              style={{
                marginTop: 10,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
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
      <TouchableOpacity style={styles.button} onPress={() => deleteRoom()}>
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
