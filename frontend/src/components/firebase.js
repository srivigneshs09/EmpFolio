// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyB4eTImflGOWR_YdsRNpHAN_MPFFMTE6oo",
  authDomain: "empfolio.firebaseapp.com",
  projectId: "empfolio",
  storageBucket: "empfolio.appspot.com",
  messagingSenderId: "56825522278",
  appId: "1:56825522278:web:8c5b7069acfbf50fe7a5a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore instance
export { db };
