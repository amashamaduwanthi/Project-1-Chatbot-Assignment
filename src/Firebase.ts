import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD3E2Gam9Zy1_xlPJ9WTMA2OiCL3Hysf5Q",
    authDomain: "chatbot-assignment-9dcb6.firebaseapp.com",
    databaseURL: "https://chatbot-assignment-9dcb6-default-rtdb.firebaseio.com",
    projectId: "chatbot-assignment-9dcb6",
    storageBucket: "chatbot-assignment-9dcb6.firebasestorage.app",
    messagingSenderId: "1072043405347",
    appId: "1:1072043405347:web:302054aba602fa5ccf4196",
    measurementId: "G-MYRDJQVKWX"
}

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
