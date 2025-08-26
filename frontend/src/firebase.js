// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// optional: only enable analytics in browser
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiEVZdCCKWGBIXRxYCjHq6fW4doaPryak",
  authDomain: "cloud-kitchen-247.firebaseapp.com",
  projectId: "cloud-kitchen-247",
  storageBucket: "cloud-kitchen-247.firebasestorage.app",
  messagingSenderId: "749056991137",
  appId: "1:749056991137:web:12d0fb007ec9126c1435e0",
  measurementId: "G-L24Z24HN4E",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ✅ Optional: analytics only if supported (avoids SSR errors)
let analytics;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

// ✅ Database setup
export const db = getFirestore(app);
export { app, analytics };
