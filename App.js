import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './App/screens/LoginScreen';
import RegistrationScreen from './App/screens/RegistrationScreen';
import HomeScreen from './App/screens/HomeScreen';
import NewRoomScreen from './App/screens/NewRoomScreen';
import GameRoomScreen from './App/screens/GameRoomScreen';
import NewQuestionScreen from './App/screens/NewQuestionScreen';
import QuestionScreen from './App/screens/QuestionScreen';
import InviteToGameRoomScreen from './App/screens/InviteToGameRoomScreen';
import { decode, encode } from 'base-64';
import { firebase } from './src/firebase/config';
import { YellowBox } from 'react-native';
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

export default function App() {
  console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
  console.disableYellowBox = true;
  YellowBox.ignoreWarnings(['Setting a timer']);
  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            setUser(userData);
          })
          .catch((error) => {
            setLoading(false);
          });
        /// Get Game Room Data ////
        // console.log('id', user.uid);
        firebase
          .firestore()
          .collection('RoomMemberJunction')
          .where('userId', '==', user.uid)
          .get()
          .then((querySnapshot) => {
            const gameRoomIds = querySnapshot.docs.map(
              (doc) => doc.data().gameRoomId,
            );

            firebase
              .firestore()
              .collection('gameRooms')
              .where('id', 'in', gameRoomIds)
              .get()
              .then((snapshot) => {
                const gameRoomsData = snapshot.docs.map((document) => {
                  return document.data();
                });
                setGameRoomData(gameRoomsData);
              });
          });

        /// Question Data End ///
        // firebase
        //   .firestore()
        //   .collection('questionUserAnswer')

        //   .get()
        //   .then((querySnapshot) => {
        //     const questionAnswers = querySnapshot.docs.map((doc) => doc.data());
        //     setQuestionAnswerData(questionAnswers);
        //   });
      } else {
        setLoading(false);
      }
    });
  }, []);

  // console.log(questionData)
  // const [questionData, setQuestionData] = useState([])
  const [gameRoomData, setGameRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  // const [questionAnswerData, setQuestionAnswerData] = useState([]);

  // if (loading) {
  //   return <></>;
  // }
  // console.log('gamesRooms', gameRoomData);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen
                  name="Home"
                  {...props}
                  extraData={user}
                  {...props}
                  extraData1={gameRoomData}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="NewRoom">
              {(props) => (
                <NewRoomScreen name="NewRoom" {...props} extraData={user} />
              )}
            </Stack.Screen>
            <Stack.Screen name="NewQuestion">
              {(props) => (
                <NewQuestionScreen
                  name="NewQuestion"
                  {...props}
                  extraData={user}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="GameRoom">
              {(props) => (
                <GameRoomScreen
                  name="GameRoom"
                  {...props}
                  extraData={user}
                  extraData1={gameRoomData}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Question">
              {(props) => (
                <QuestionScreen
                  name="Question"
                  {...props}
                  extraData={user}
                  extraData1={gameRoomData}
                  // extraData2={questionAnswerData}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Invite">
              {(props) => (
                <InviteToGameRoomScreen
                  name="Invite"
                  {...props}
                  extraData={user}
                  extraData1={gameRoomData}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
