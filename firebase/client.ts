// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbiILXy3KQxUmAulb7ogmKdUXO1jqNgwI",
  authDomain: "mantis-76c8c.firebaseapp.com",
  projectId: "mantis-76c8c",
  storageBucket: "mantis-76c8c.firebasestorage.app",
  messagingSenderId: "352604629084",
  appId: "1:352604629084:web:44e52c049efc29fd9e1e99",
  measurementId: "G-W4ZC6E9778"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);