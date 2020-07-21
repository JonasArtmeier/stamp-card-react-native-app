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
} from 'react-native';
import { firebase } from '../../src/firebase/config';
import Spacer from '../components/Spacer';
// import { useScreens } from 'react-native-screens';
import { useNavigation } from '@react-navigation/native';
// import GameRooms from '../components/GameRooms';
// import RNRestart from 'react-native-restart';

export default function QuestionScreen(props) {
  // const navigation = useNavigation();
  const questionData = props.route.params.questionData;
  const userID = props.extraData.id;
  const [instantUserAnswer, setInstantUserAnswer] = useState('');
  const [questionAnswerData, setQuestionAnswerData] = useState([]);
  const userAnswered = questionAnswerData.map((item) => item.userId);
  const allAnsweres = questionAnswerData.map((it) => it.userAnswer);
  const [myAnswerHistory, setMyAnswerHistory] = useState('');
  const allA = allAnsweres.filter((ite) => ite === 'A');
  const allB = allAnsweres.filter((ite) => ite === 'B');
  const allC = allAnsweres.filter((ite) => ite === 'C');
  const allD = allAnsweres.filter((ite) => ite === 'D');
  const [lockQuestion, setLockQuestion] = useState('');
  // const myTrueAnswer = myAnswer[0].userAnswer;

  useEffect(() => {
    firebase
      .firestore()
      .collection('questionUserAnswer')
      .where('questionId', '==', questionData.id)
      .get()
      .then((querySnapshot) => {
        const questionAnswers = querySnapshot.docs.map((doc) => doc.data());
        // console.log('databas', querySnapshot.docs.data());
        setQuestionAnswerData(questionAnswers);
        const myAnswer = questionAnswers.filter((ite) => ite.userId === userID);
        setMyAnswerHistory(myAnswer[0].userAnswer);
      });
  }, [lockQuestion, questionData.id, userID]);

  const onAnswerClick = (e) => {
    if (userAnswered.includes(userID) === true) {
      alert('already locked');
      return;
    }
    const data = {
      questionId: questionData.id,
      userId: userID,
      userAnswer: e,
    };
    firebase
      .firestore()
      .collection('questionUserAnswer')
      .add(data)
      .catch((error) => {
        alert(error);
      });
    setInstantUserAnswer(e);
    setLockQuestion('locked');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>{questionData.question}</Text>
      <TouchableOpacity
        style={styles.firstBox}
        onPress={(e) => {
          if (lockQuestion === 'locked') {
            alert('already locked');
            return;
          }
          onAnswerClick('A');
        }}
      >
        <Text style={styles.buttonText}>A: {questionData.answer1}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.firstBox}
        onPress={(e) => {
          if (lockQuestion === 'locked') {
            alert('already locked');
            return;
          }
          onAnswerClick('B');
        }}
      >
        <Text style={styles.buttonText} value="B">
          B: {questionData.answer2}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.firstBox}
        onPress={(e) => {
          if (lockQuestion === 'locked') {
            alert('already locked');
            return;
          }
          onAnswerClick('C');
        }}
      >
        <Text style={styles.buttonText} value="C">
          C: {questionData.answer3}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.firstBox}
        onPress={(e) => {
          if (lockQuestion === 'locked') {
            alert('already locked');
            return;
          }
          onAnswerClick('D');
        }}
      >
        <Text style={styles.buttonText} value="D">
          D: {questionData.answer4}
        </Text>
      </TouchableOpacity>
      <View>
        {userAnswered.includes(userID) === true ? (
          <Text style={styles.headline}>
            Your Answer was: {myAnswerHistory}{' '}
          </Text>
        ) : (
          <Text style={styles.headline}>
            Your Answer was: {instantUserAnswer}{' '}
          </Text>
        )}
      </View>
      <View style={styles.gameRooms}>
        {myAnswerHistory !== '' ? (
          <>
            <Text style={styles.headline}>All Answers:</Text>
            <View style={styles.firstBox}>
              <Text>A: {allA.length}</Text>
            </View>
            <View style={styles.firstBox}>
              <Text>B: {allB.length}</Text>
            </View>
            <View style={styles.firstBox}>
              <Text>C: {allC.length}</Text>
            </View>
            <View style={styles.firstBox}>
              <Text>D: {allD.length}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.firstBox}>
              <Text>Lock your answer to see all asnwers</Text>
            </View>
          </>
        )}
      </View>
      <Footer />
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
    marginRight: 30,
    marginLeft: 30,
    marginTop: 20,
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
