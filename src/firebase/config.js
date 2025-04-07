
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGeXiRt3fZr5gsLw4iSu9Lb9dVgeYs7w0",
  authDomain: "nando-s-restaurant.firebaseapp.com",
  projectId: "nando-s-restaurant",
  storageBucket: "nando-s-restaurant.appspot.com",
  messagingSenderId: "92112194337",
  appId: "1:92112194337:web:0e7960f16b019a92c08c60",
  measurementId: "G-MFM31NG8N9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;