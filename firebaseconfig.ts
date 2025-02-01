import { initializeApp } from 'firebase/app';
import {getFirestore, collection, addDoc,getDocs,setDoc,disableNetwork} from "firebase/firestore";
import { getDatabase,set,ref, get,onValue,orderByChild,equalTo,DataSnapshot,query} from "firebase/database";

const firebaseConfig = {
    
};


 const app = initializeApp(firebaseConfig);
 const db =  getFirestore(app)
const database = getDatabase(app);


export {
    app,
    db,
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
