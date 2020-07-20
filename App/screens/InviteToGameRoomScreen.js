import React, { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
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
import { useScreens } from 'react-native-screens';
import { useNavigation } from '@react-navigation/native';

export default function InviteToGameRoomScreen(props) {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState('');
  const [memberIds, setMemberIds] = useState('');
  // const [question, setQuestion] = useState('');

  // const userRef = firebase.firestore().collection('users');

  const userID = props.extraData.id;
  const myUserName = props.extraData.fullName;
  const gameRoomId = props.route.params.myGameRoom.id;

  useEffect(() => {
    firebase
      .firestore()
      .collection('users')
      .get()
      .then((querySnapshot) => {
        // const fullName = querySnapshot.docs.map((doc) => doc.data().fullName);
        const userData = querySnapshot.docs.map((doc) => doc.data());
        // setUserName(fullName);
        setUserData(userData);
      });
    firebase
      .firestore()
      .collection('RoomMemberJunction')
      .where('gameRoomId', '==', gameRoomId)
      .get()
      .then((querySnapshot) => {
        const userIds = querySnapshot.docs.map((doc) => doc.data().userId);
        setMemberIds(userIds);
      });
  }, [userData, gameRoomId]);

  const onInviteUser = (item) => {
    if (memberIds.includes(item.id) === true) {
      alert('is already a member');
      return;
    }

    const data = {
      gameRoomId: gameRoomId,
      userId: item.id,
    };
    firebase
      .firestore()
      .collection('RoomMemberJunction')
      .add(data)
      .then((response) => {
        firebase
          .firestore()
          .collection('RoomMemberJunction')
          .doc(response.id)
          .update({
            id: response.id,
          });
        alert('has been added');
      });
  };

  //   firebase
  //         .firestore()
  //         .collection('RoomMemberJunction')
  //         .where('gameRoomId', '==', gameRoomId)
  //         .get()
  //         .then((querySnapshot) => {
  //           const gameRoomIds = querySnapshot.docs.map(
  //             (doc) => doc.data().userId,
  //           );
  // }
  // // console.log(gameRoomId)
  // const onCreateQuestion = () => {
  //   if (question && question.length <= 0) {
  //     alert('Enter a Question');
  //     return;
  //   }
  //   const data = {
  //     question: question,
  //     type: questionType,
  //     answer1: answer1,
  //     answer2: answer2,
  //     answer3: answer3,
  //     answer4: answer4,
  //     creator: userID,
  //   };
  //   questionRef
  //     .add(data)
  //     .then((response) => {
  //       firebase.firestore().collection('questions').doc(response.id).update({
  //         id: response.id,
  //       });
  //       firebase
  //         .firestore()
  //         .collection('QuestionRoomJunction')
  //         .add({ questionId: response.id, gameRoomId: gameRoomId })
  //         .then((res) => {
  //           firebase
  //             .firestore()
  //             .collection('QuestionRoomJunction')
  //             .doc(res.id)
  //             .update({
  //               id: res.id,
  //             });
  //         });
  //     })
  //     .catch((error) => {
  //       alert(error);
  //     });
  // };
  // console.log(userIds);
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.container}>
          <FlatList
            data={userData}
            renderItem={({ item, index }) => (
              <View
                style={{
                  height: 50,
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {userName !== myUserName ? (
                  <Text
                    onPress={() =>
                      // alert(item.id)}
                      //   // navigation.navigate('GameRoom', {
                      //   //   myGameRoom: item,
                      //   // })
                      onInviteUser(item)
                    }
                  >
                    User: {item.fullName}
                  </Text>
                ) : (
                  <Text>No Game Room</Text>
                )}
              </View>
            )}
          />
        </View>
      </View>
    </View>
    // {/* <View>
    //   <TouchableOpacity onPress={() => logOutPress()}>
    //     <Text>Logout</Text>
    //   </TouchableOpacity>
    // </View> */}
    // {/* {entities && (
    //   <View style={styles.listContainer}>
    //     <FlatList
    //       data={entities}
    //       renderItem={renderEntity}
    //       keyExtractor={(item) => item.id}
    //       removeClippedSubviews={true}
    //     /> */}
    // {/* </View> */}
    // {/* )} */}
    // </View>
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
  logOutButton: { flex: 1, backgroundColor: 'black' },
  formContainer: {
    flexDirection: 'row',
    height: 80,
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
