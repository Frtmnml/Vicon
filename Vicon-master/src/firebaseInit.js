import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyCJlHa03rOf0LvDy1U7fYLJP1mHR4sDifE",
    authDomain: "vicon-scanner.firebaseapp.com",
    projectId: "vicon-scanner",
    storageBucket: "vicon-scanner.appspot.com",
    messagingSenderId: "981744196829",
    appId: "1:981744196829:web:58f9777d47e52b52c50f34",
    measurementId: "G-NG24B7Y9PL"
};

const app = initializeApp(firebaseConfig);

export default app;