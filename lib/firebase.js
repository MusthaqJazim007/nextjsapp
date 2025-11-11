// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClqhR3jDLVnvebi8intLycKIuyaBKzMMk",
  authDomain: "nextjsapp-14686.firebaseapp.com",
  projectId: "nextjsapp-14686",
  storageBucket: "nextjsapp-14686.firebasestorage.app",
  messagingSenderId: "733154612681",
  appId: "1:733154612681:web:4101886a9a4550c2ee4418",
  measurementId: "G-SY1E8TRT1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
