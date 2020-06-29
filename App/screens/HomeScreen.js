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
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen(props) {
  const userFullName = props.extraData.fullName;
  const navigation = useNavigation();

  const logOutPress = () => {
    firebase.auth().signOut();
    navigation.navigate('Login'); // <== This will signout from firebase

    // this.props.navigation.navigate('Login'); // <== We navigate to the loading screen we set earlier, which will check if there is a userId and navigate accordingly
  };

  return (
    <View style={styles.container}>
      <View style={styles.firstBox}>
        <Text style={styles.buttonText}>
          Welcome : {userFullName}
          {'\n'} Statistics
        </Text>
      </View>
      <View style={styles.firstBox}>
        <Text style={styles.buttonText}>Here can be your ad</Text>
      </View>
      <View style={styles.formContainer}>
        <TouchableOpacity
          style={styles.newRoomButton}
          onPress={() => navigation.navigate('NewRoom')}
        >
          <Text>Create New Game Room</Text>
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
  newRoomButton: { flex: 1, backgroundColor: '#788eec' },
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
