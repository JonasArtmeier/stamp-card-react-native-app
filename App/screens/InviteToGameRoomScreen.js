import Footer from '../components/Footer';
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
  Image,
} from 'react-native';
import { firebase } from '../../src/firebase/config';
import { useScreens } from 'react-native-screens';
import { useNavigation, useIsFocused } from '@react-navigation/native';

export default function InviteToGameRoomScreen(props) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState('');
  const [memberIds, setMemberIds] = useState('');
  const [lockUser, setLockUser] = useState('');
  const [myGameRoomIds, setMyGameRoomIds] = useState('');
  // const [question, setQuestion] = useState('');

  // const userRef = firebase.firestore().collection('users');

  const userID = props.extraData.id;
  const myUserName = props.extraData.fullName;
  const gameRoomId = props.route.params.myGameRoom.id;

  useEffect(() => {
    if (!isFocused) return;
    firebase
      .firestore()
      .collection('users')
      .get()
      .then((querySnapshot) => {
        // const fullName = querySnapshot.docs.map((doc) => doc.data().fullName);
        const userDatas = querySnapshot.docs.map((doc) => doc.data());
        // setUserName(fullName);
        setUserData(userDatas);
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
  }, [gameRoomId, isFocused]);

  const onInviteUser = (item) => {
    if (memberIds.includes(item.id) === true) {
      alert('is already a member');
      return;
    }
    firebase
      .firestore()
      .collection('RoomMemberJunction')
      .where('userId', '==', item.id)
      .get()
      .then((querySnapshot) => {
        const gameRoomIds = querySnapshot.docs.map(
          (doc) => doc.data().gameRoomId,
        );
        setMyGameRoomIds(gameRoomIds);
      });
    if (myGameRoomIds.length > 9) {
      alert('The user is in to many Rooms');
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
        setLockUser(item.id);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Invite a Friend </Text>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <Text style={styles.headline}>User:</Text>
      <View style={styles.gameRooms}>
        <FlatList
          data={userData}
          renderItem={({ item, index }) => (
            <View
              style={{
                marginTop: 10,
                height: 50,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {userName !== myUserName ? (
                <Text
                  style={styles.flatListText}
                  onPress={() => {
                    if (lockUser.includes(item.id)) {
                      alert('User already added');
                      return;
                    }
                    // alert(item.id)}
                    //   // navigation.navigate('GameRoom', {
                    //   //   myGameRoom: item,
                    //   // })
                    onInviteUser(item);
                  }}
                >
                  {item.fullName}
                </Text>
              ) : (
                <Text style={styles.flatListText}>No Users</Text>
              )}
            </View>
          )}
        />
      </View>

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
    flex: 3,
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
