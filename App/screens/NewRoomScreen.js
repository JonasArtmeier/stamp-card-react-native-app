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
import { ReloadInstructions } from 'react-native/Libraries/NewAppScreen';

export default function NewRoomScreen(props) {
  const [gameRoomName, setGameRoomName] = useState('');
  const [questionStart, setQuestionStart] = useState('');
  const [questionEnd, setQuestionEnd] = useState('');
  const [gameRoomId, setGameRoomId] = useState('');
  const [id, setId] = useState('');
  const navigation = useNavigation();
  const gameRoomRef = firebase.firestore().collection('gameRooms');
  // const roomMemberJunctionRef = firebase
  //   .firestore()
  //   .colltection('RoomMemberJunction');
  const userID = props.extraData.id;

  const onCreateRoom = () => {
    if (gameRoomName && gameRoomName.length <= 0) {
      alert('Enter a name');
      return;
    }
    const data = {
      name: gameRoomName,
      questionStart: questionStart,
      questionEnd: questionEnd,
      creator: userID,
    };
    gameRoomRef
      .add(data)
      .then((response) => {
        firebase.firestore().collection('gameRooms').doc(response.id).update({
          id: response.id,
        });
        firebase
          .firestore()
          .collection('RoomMemberJunction')
          .add({ gameRoomId: response.id, userId: userID })
          .then((res) => {
            firebase
              .firestore()
              .collection('RoomMemberJunction')
              .doc(res.id)
              .update({
                id: res.id,
              });
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Game Room Name"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setGameRoomName(text)}
          value={gameRoomName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />

        <View style={styles.container}>
          <Text>Start</Text>
          <RNPickerSelect
            onValueChange={(text) => setQuestionStart(text)}
            label="start"
            items={[
              { label: '1am', value: '01:00' },
              { label: '2am', value: '02:00' },
              { label: '3am', value: '03:00' },
              { label: '4am', value: '04:00' },
              { label: '5am', value: '05:00' },
              { label: '6am', value: '06:00' },
              { label: '7am', value: '07:00' },
              { label: '8am', value: '08:00' },
              { label: '9am', value: '09:00' },
              { label: '10am', value: '10:00' },
              { label: '11am', value: '11:00' },
              { label: '12am', value: '12:00' },
              { label: '1pm', value: '13:00' },
              { label: '2pm', value: '14:00' },
              { label: '3pm', value: '15:00' },
              { label: '4pm', value: '16:00' },
              { label: '5pm', value: '17:00' },
              { label: '6pm', value: '18:00' },
              { label: '7pm', value: '19:00' },
              { label: '8pm', value: '20:00' },
              { label: '9pm', value: '21:00' },
              { label: '10pm', value: '22:00' },
              { label: '11pm', value: '23:00' },
              { label: '12pm', value: '24:00' },
            ]}
          />
        </View>
        <View style={styles.container}>
          <Text>End</Text>
          <RNPickerSelect
            onValueChange={(text) => setQuestionEnd(text)}
            label="start"
            items={[
              { label: '1am', value: '01:00' },
              { label: '2am', value: '02:00' },
              { label: '3am', value: '03:00' },
              { label: '4am', value: '04:00' },
              { label: '5am', value: '05:00' },
              { label: '6am', value: '06:00' },
              { label: '7am', value: '07:00' },
              { label: '8am', value: '08:00' },
              { label: '9am', value: '09:00' },
              { label: '10am', value: '10:00' },
              { label: '11am', value: '11:00' },
              { label: '12am', value: '12:00' },
              { label: '1pm', value: '13:00' },
              { label: '2pm', value: '14:00' },
              { label: '3pm', value: '15:00' },
              { label: '4pm', value: '16:00' },
              { label: '5pm', value: '17:00' },
              { label: '6pm', value: '18:00' },
              { label: '7pm', value: '19:00' },
              { label: '8pm', value: '20:00' },
              { label: '9pm', value: '21:00' },
              { label: '10pm', value: '22:00' },
              { label: '11pm', value: '23:00' },
              { label: '12pm', value: '24:00' },
            ]}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Home');
          onCreateRoom();
        }}
      >
        <Text style={styles.buttonText}>create Room</Text>
      </TouchableOpacity>
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
