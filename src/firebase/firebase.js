// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDYqhM1SAZWwPWnAjNDDN8z0v-HQEYW9TM",
    authDomain: "terraguide-7d1b2.firebaseapp.com",
    projectId: "terraguide-7d1b2",
    storageBucket: "terraguide-7d1b2.firebasestorage.app",
    messagingSenderId: "1069196449054",
    appId: "1:1069196449054:web:527f02214fb5dd0535250f",
    measurementId: "G-P5F558GKCF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };