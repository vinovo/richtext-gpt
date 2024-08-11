// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCH59nRDWsT7gizxacWuK6-RzwqTidIf3E",
  authDomain: "richtext-gpt.firebaseapp.com",
  projectId: "richtext-gpt",
  storageBucket: "richtext-gpt.appspot.com",
  messagingSenderId: "1097678536269",
  appId: "1:1097678536269:web:679304c5568aa79f692604",
  measurementId: "G-MNGWMTTN5Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

export { db };