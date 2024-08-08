// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAI8YXPmlom-C-27W8VojITM82UWJBZh5I",
  authDomain: "pantry-management-47ef9.firebaseapp.com",
  projectId: "pantry-management-47ef9",
  storageBucket: "pantry-management-47ef9.appspot.com",
  messagingSenderId: "928476058955",
  appId: "1:928476058955:web:0c1e8956e53e79e35844ce",
  measurementId: "G-7D989XQGLD",
  databaseURL: "https://pantry-management-47ef9-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

