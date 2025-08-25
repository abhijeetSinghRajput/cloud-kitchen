// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiEVZdCCKWGBIXRxYCjHq6fW4doaPryak",
  authDomain: "cloud-kitchen-247.firebaseapp.com",
  projectId: "cloud-kitchen-247",
  storageBucket: "cloud-kitchen-247.firebasestorage.app",
  messagingSenderId: "749056991137",
  appId: "1:749056991137:web:12d0fb007ec9126c1435e0",
  measurementId: "G-L24Z24HN4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);