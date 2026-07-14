import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoKo_lgJ7itmQbm7nnpxw3zT46chWorZc",
  authDomain: "ticket-booking-e1513.firebaseapp.com",
  projectId: "ticket-booking-e1513",
  storageBucket: "ticket-booking-e1513.firebasestorage.app",
  messagingSenderId: "599896281609",
  appId: "1:599896281609:web:763134c9728f4ed6b75ed8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
