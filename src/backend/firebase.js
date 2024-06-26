// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANaRxouQzGgW9truUFcbjOVMgheVom5zA",
  authDomain: "stockapp-b5234.firebaseapp.com",
  projectId: "stockapp-b5234",
  storageBucket: "stockapp-b5234.appspot.com",
  messagingSenderId: "263626198396",
  appId: "1:263626198396:web:b540fe81eeb793cbd628f9"
};
const app = initializeApp(firebaseConfig);
// Initialize Firebase
export const db = getFirestore(app); // firebase.firestore(); if do the other way
export const storage = getStorage(app); // firebase.storage();