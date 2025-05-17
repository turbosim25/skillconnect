// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2nnAk_mky958OAl5pVVuI-Cxb9rOAy0E",
  authDomain: "skillconnect-f889d.firebaseapp.com",
  projectId: "skillconnect-f889d",
  storageBucket: "skillconnect-f889d.firebasestorage.app",
  messagingSenderId: "607035031288",
  appId: "1:607035031288:web:ebe13e60835860657d850d",
  measurementId: "G-BDSHB5PYL8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);