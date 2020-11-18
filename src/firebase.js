import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { functions } from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAtKxPuMkhX5_gUxWOLK1eppFiTgwOMZ3w",
  authDomain: "vd-1-59e53.firebaseapp.com",
  databaseURL: "https://vd-1-59e53.firebaseio.com",
  projectId: "vd-1-59e53",
  storageBucket: "vd-1-59e53.appspot.com",
  messagingSenderId: "61589958525",
  appId: "1:61589958525:web:a26559d44d08c003d2e614",
  measurementId: "G-1MVLMTY1J6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return ;

  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  console.log(snapshot) ;

  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
  
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};
