import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDPbZig_N5J8c_6jI8XQmEINHluJPxGM7E",
  authDomain: "simpls-6a1a3.firebaseapp.com",
  projectId: "simpls-6a1a3",
  storageBucket: "simpls-6a1a3.appspot.com",
  messagingSenderId: "1024509421193",
  appId: "1:1024509421193:web:c6a679cc46ebbf498dc858"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);