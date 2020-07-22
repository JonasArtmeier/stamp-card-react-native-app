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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../src/firebase/config';
import { useScreens } from 'react-native-screens';
import { useNavigation } from '@react-navigation/native';

export default function NewQuestionScreen(props) {
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [correctAnswer, getCorrectAnswer] = useState('');
  const [lockButton, setLockButton] = useState('');
  const navigation = useNavigation();
  const questionRef = firebase.firestore().collection('questions');

  const userID = props.extraData.id;
  const gameRoomId = props.route.params.myGameRoom.id;

  const onCreateQuestion = () => {
    if (question === '') {
      alert('Enter a Question');
      return;
    }
    const data = {
      question: question,
      type: questionType,
      answer1: answer1,
      answer2: answer2,
      answer3: answer3,
      answer4: answer4,
      creator: userID,
    };
    questionRef
      .add(data)
      .then((response) => {
        firebase.firestore().collection('questions').doc(response.id).update({
          id: response.id,
        });
        firebase
          .firestore()
          .collection('QuestionRoomJunction')
          .add({ questionId: response.id, gameRoomId: gameRoomId })
          .then((res) => {
            firebase
              .firestore()
              .collection('QuestionRoomJunction')
              .doc(res.id)
              .update({
                id: res.id,
              })
              .then(() => {
                navigation.navigate('GameRoom');
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
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always"
      >
        <Text style={styles.headline}>Question type</Text>

        <RNPickerSelect
          onValueChange={(text) => setQuestionType(text)}
          label="start"
          items={[
            // { label: 'open Question', value: 'open Question' },
            { label: 'multiple choice', value: 'multiple choice' },
            // { label: 'closed Question', value: 'closed Question' },
          ]}
        />

        <Text style={styles.headline}>Your Question</Text>
        <TextInput
          multiline
          style={styles.input}
          placeholder="Your Question"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setQuestion(text)}
          value={question}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <View style={styles.container}>
          <Text>Answer 1</Text>
          <TextInput
            multiline
            style={styles.input}
            placeholder="Answer 1"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setAnswer1(text)}
            value={answer1}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          <Text>Answer 2</Text>
          <TextInput
            multiline
            style={styles.input}
            placeholder="Answer 2"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setAnswer2(text)}
            value={answer2}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          <Text>Answer 3</Text>
          <TextInput
            multiline
            style={styles.input}
            placeholder="Answer 3"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setAnswer3(text)}
            value={answer3}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          <Text>Answer 4</Text>
          <TextInput
            multiline
            style={styles.input}
            placeholder="Answer 4"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setAnswer4(text)}
            value={answer4}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (lockButton === 'locked') {
              return;
            }
            // navigation.navigate('GameRoom');
            onCreateQuestion();
          }}
        >
          <Text style={styles.buttonText}>create question</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
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
    marginTop: 20,
    height: 48,
    fontSize: 20,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'deepskyblue',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 40,
    marginBottom: 20,
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
    backgroundColor: 'azure',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    alignSelf: 'stretch',
  },
  select: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'azure',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
});
