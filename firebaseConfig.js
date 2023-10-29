import { getDatabase } from "firebase/database";
import firebase from "firebase/compat/app"

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}
const db = getDatabase();

export { db };
