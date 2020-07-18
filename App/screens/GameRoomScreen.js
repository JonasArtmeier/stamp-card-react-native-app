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
import Spacer from '../components/Spacer';
// import { useScreens } from 'react-native-screens';
import { useNavigation } from '@react-navigation/native';
import GameRooms from '../components/GameRooms';
// import myGameRoom from '../screens/HomeScreen';

export default function GameRoomScreen(props) {
  useEffect(() => {
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
  }, []);

  const [questionData, setQuestionData] = useState([]);
  const userFullName = props.extraData.fullName;
  const navigation = useNavigation();
  const userID = props.extraData.id;
  const myGameRoom = props.route.params.myGameRoom;
  console.log('final', questionData);
  const logOutPress = () => {
    firebase.auth().signOut();
    navigation.navigate('Login'); // <== This will signout from firebase
  };
  // console.log('extradata', props.route.params.myGameRoom.name);

  return (
    <View style={styles.container}>
      <View style={styles.firstBox}>
        <Text style={styles.buttonText}>{myGameRoom.name}</Text>
      </View>
      <Spacer />
      <View style={styles.firstBox}>
        <Text style={styles.buttonText}>Here can be your ad</Text>
      </View>
      <View style={styles.firstBox}>
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
      </View>
      <FlatList
        data={questionData}
        renderItem={({ item, index }) => (
          <View
            style={{
              height: 50,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {questionData !== undefined ? (
              <Text
                onPress={() =>
                  navigation.navigate('Question', {
                    questionData: item,
                  })
                }
              >
                Question: {item.question}
              </Text>
            ) : (
              <Text>No Question</Text>
            )}
          </View>
        )}
      />
      <View style={styles.formContainer}>
        <TouchableOpacity
          style={styles.newRoomButton}
          onPress={() =>
            navigation.navigate('NewQuestion', {
              myGameRoom: myGameRoom,
            })
          }
        >
          <Text style={styles.buttonText}>Invite a Friend</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <TouchableOpacity
          style={styles.newRoomButton}
          onPress={() =>
            navigation.navigate('Invite', {
              myGameRoom: myGameRoom,
            })
          }
        >
          <Text style={styles.buttonText}>Create a Question</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => logOutPress()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/// styles ///
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    zIndex: -1,
    flex: 1,
    alignItems: 'center',
  },
  firstBox: {
    flexDirection: 'column',
    borderWidth: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#788eec',
    alignSelf: 'stretch',
  },
  newRoomButton: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#788eec',
    alignContent: 'center',
  },
  formContainer: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 20,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  listContainer: {
    marginTop: 20,
    padding: 20,
  },
  entityContainer: {
    marginTop: 16,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  entityText: {
    fontSize: 20,
    color: '#333333',
  },
});
