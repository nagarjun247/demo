import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';
import * as val from '../utils/const';

if (!firebase.apps.length) {
  const config = {
    apiKey: "AIzaSyDFeLFsR0TAbXJXpi6oESqlM9DBW_1SK8s",
    authDomain: "chanakya-dev.firebaseapp.com",
    databaseURL: "https://chanakya-dev.firebaseio.com",
    projectId: "chanakya-dev",
    storageBucket: "chanakya-dev.appspot.com",
    messagingSenderId: "364009836208"
  };
  firebase.initializeApp(config);
}

export const auth  = firebase.auth();
export const db    = firebase.database();
export const store = firebase.firestore();

export const func  = firebase.app().functions(val.REGION_FUNC);
// export const func  = firebase.functions();
