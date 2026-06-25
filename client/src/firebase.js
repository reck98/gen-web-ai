// /* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "gen-web-ai-23c4d.firebaseapp.com",
    projectId: "gen-web-ai-23c4d",
    storageBucket: "gen-web-ai-23c4d.firebasestorage.app",
    messagingSenderId: "234788403505",
    appId: "1:234788403505:web:c39a8d7eae9ca6c5ffd810",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
