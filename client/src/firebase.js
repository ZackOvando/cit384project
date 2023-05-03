// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1KYiIq3rCymjzirh5ACsxXMUp0yl0-9M",
  authDomain: "cit384-8d9d0.firebaseapp.com",
  projectId: "cit384-8d9d0",
  storageBucket: "cit384-8d9d0.appspot.com",
  messagingSenderId: "485881458573",
  appId: "1:485881458573:web:c246491916b30d55b4d7c4",
  measurementId: "G-QDSXMJ87HM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);