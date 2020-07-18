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
  console.log('non database', questionAnswerData);
  console.log(allB.length);
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
      <View style={styles.firstBox}>
        <Text style={styles.buttonText}>{questionData.question}</Text>
      </View>
      <Spacer />
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
          <Text>Your Answer: {myAnswerHistory} </Text>
        ) : (
          <Text>Your Answer: {instantUserAnswer} </Text>
        )}
      </View>
      <View style={styles.firstBox}>
        {myAnswerHistory !== '' ? (
          <>
            <Text>All Answers</Text>
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
    </View>
  );
}

/// styles ///
const styles = StyleSheet.create({
  container: {
    padding: 10,
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
