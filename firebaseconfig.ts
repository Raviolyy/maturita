import { initializeApp } from 'firebase/app';
import {getFirestore, collection, addDoc,getDocs,setDoc,disableNetwork} from "firebase/firestore";
import { getDatabase,set,ref, get,onValue,orderByChild,equalTo,DataSnapshot,query} from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA7AuKfkq6u4gi1FwKZLyIyrwXMPDciRVI",
    authDomain: "sloba-ee6d9.firebaseapp.com",
    databaseURL: "https://sloba-ee6d9-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sloba-ee6d9",
    storageBucket: "sloba-ee6d9.firebasestorage.app",
    messagingSenderId: "181625426437",
    appId: "1:181625426437:web:2ec7c78c7992f1791a826c"
};


 const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


export {
    app,
    database,
    set,
    get,
    ref,
    getFirestore,
    collection,
    addDoc,
    getDocs,
    setDoc,
    disableNetwork,
    onValue,
    orderByChild,
    equalTo,
    DataSnapshot,
    query
}
