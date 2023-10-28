import { getDatabase } from "firebase/database";
import firebase from "firebase/compat/app"

const firebaseConfig = {
  apiKey: "AIzaSyDaPEM7QYP3fTKZX-ThJMUSJOGOwrk2l28",
  authDomain: "shop-8d237.firebaseapp.com",
  databaseURL: "https://shop-8d237-default-rtdb.firebaseio.com",
  projectId: "shop-8d237",
  storageBucket: "shop-8d237.appspot.com",
  messagingSenderId: "sender-id",
  appId: "1:212546097473:android:103649304333c51e9691c",
  measurementId: "G-measurement-id",
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}
const db = getDatabase();

export { db };
