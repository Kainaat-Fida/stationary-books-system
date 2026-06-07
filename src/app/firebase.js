import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAD9b-BuLBLu6CSP02m-eDqPdjwCJBBesE",
  authDomain: "stationary-book-system.firebaseapp.com",
  projectId: "stationary-book-system",
  storageBucket: "stationary-book-system.firebasestorage.app",
  messagingSenderId: "766684407572",
  appId: "1:766684407572:web:598088a756d53369040401"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
