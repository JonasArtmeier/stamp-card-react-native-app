import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAPv24J164i23_SjE8IwhTIPrBrFOJqVlU',
  authDomain: 'stamp-card-app.firebaseapp.com',
  databaseURL: 'https://stamp-card-app.firebaseio.com',
  projectId: 'stamp-card-app',
  storageBucket: 'stamp-card-app.appspot.com',
  messagingSenderId: '193386451602',
  appId: '1:193386451602:android:88acba2d655df74c738c4b',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
