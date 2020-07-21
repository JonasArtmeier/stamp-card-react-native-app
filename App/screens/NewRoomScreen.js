import React, { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import Footer from '../components/Footer';
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
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function NewRoomScreen(props) {
  const [gameRoomName, setGameRoomName] = useState('');
  const [questionStart, setQuestionStart] = useState('');
  const [questionEnd, setQuestionEnd] = useState('');
  const [gameRoomId, setGameRoomId] = useState('');
  const [id, setId] = useState('');
  const [lockButton, setLockButton] = useState('');
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
              })
              .then(() => {
                navigation.navigate('Home');
              });
          });
      })
      .catch((error) => {
        alert(error);
      });
    setLockButton('locked');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Create a new Game Room</Text>

      {/* <View style={styles.input}> */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setGameRoomName(text)}
        value={gameRoomName}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />

      <Text style={styles.headline}>Start</Text>
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

      <Text style={styles.headline}>End</Text>
      <RNPickerSelect
        style={styles.input}
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

      {/* </View> */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (lockButton === 'locked') {
            return;
          }
          onCreateRoom();
        }}
      >
        <Text style={styles.buttonText}>create Room</Text>
      </TouchableOpacity>

      <Footer />
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
    zIndex: -1,
    flex: 1,
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  headline: {
    marginTop: 20,
    height: 48,
    fontSize: 20,
    alignItems: 'center',
    fontWeight: 'bold',
    alignSelf: 'center',
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
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    alignSelf: 'stretch',
  },
});
