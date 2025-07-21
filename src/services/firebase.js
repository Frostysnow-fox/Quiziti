// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat and later, measurementId is optional
const firebaseConfig = {
  // Replace these with your actual Firebase config values
  apiKey: "AIzaSyDU7Fh6jxX8iaNq_zLrc9WgePfPPzgSsyg",
  authDomain: "quiziti-platform.firebaseapp.com",
  projectId: "quiziti-platform",
  storageBucket: "quiziti-platform.firebasestorage.app",
  messagingSenderId: "21585904441",
  appId: "1:21585904441:web:947eda90057758d9b81ee8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;