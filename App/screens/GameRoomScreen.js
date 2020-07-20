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
      <Text style={styles.headline}>{myGameRoom.name}</Text>
      <View style={styles.firstBox}>
        <Text style={styles.buttonText}>Here can be your ad</Text>
      </View>
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
                <Text>No Question</Text>
              )}
            </View>
          )}
        />
      </View>
      <View style={styles.formContainer}>
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
      </View>
      <View style={styles.formContainer}>
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
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => logOutPress()}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
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
