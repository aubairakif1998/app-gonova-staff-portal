// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use 
// const firebaseConfig = {
//     apiKey: process.env.Firebase_apiKey,
//     authDomain: process.env.Firebase_authDomain,
//     projectId: process.env.Firebase_projectId,
//     storageBucket: process.env.Firebase_storageBucket,
//     messagingSenderId: process.env.Firebase_messagingSenderId,
//     appId: process.env.Firebase_appId,
//     measurementId: process.env.Firebase_measurementId
// };

const firebaseConfig = {
    apiKey: "AIzaSyA-hq7OuTrUii_TfenV88WI1sPrGJbQ-IE",
    authDomain: "nova-solutions-76986.firebaseapp.com",
    projectId: "nova-solutions-76986",
    storageBucket: "nova-solutions-76986.appspot.com",
    messagingSenderId: "674248794230",
    appId: "1:674248794230:web:6b9bc0cfca954c2eefbf57",
    measurementId: "G-L71586XP5N"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };