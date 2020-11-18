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
// Initialize Firebase khởi tạo
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();   //tạo auth
export const firestore = firebase.firestore();   // tạo firestore

const provider = new firebase.auth.GoogleAuthProvider(); // tạo provider
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};  // đăng nhập vs google

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return ;

  const userRef = firestore.doc(`users/${user.uid}`);  
  const snapshot = await userRef.get();  // get lần đầu k có nên exists false , nên tạo doc lần đầu
  console.log(snapshot) ;  

  if (!snapshot.exists) {   
    // đăng ký lần đầu exists trả về false , lần sau đã có dữ liệu trả về true
    const { email, displayName, photoURL } = user;
  
    try {
      await userRef.set({  // set để add vào collection : firebase.doc.set()
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
      ...userDocument.data()   // firestore.doc.get.data() : lấy dữ liệu
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};
