import firebase from "firebase/app";
import "firebase/firestore";

const PROJECT_ID = process.env.FIREBASE_PROJECT;

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  storageBucket: `${PROJECT_ID}.appspot.com`,
  projectId: PROJECT_ID,
};

export const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.firestore();
