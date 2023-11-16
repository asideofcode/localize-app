import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB7xMaHBqOvZ1NkcYXWa6Lv1U2_OW6BLxg",
    authDomain: "localise-aquamarine.firebaseapp.com",
    projectId: "localise-aquamarine",
    storageBucket: "localise-aquamarine.appspot.com",
    messagingSenderId: "223470847695",
    appId: "1:223470847695:web:cbae6e2c4bd026bdc899ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Async function to fetch a document
async function fetchDocument(path) {
    const docRef = doc(db, ...path.split('/'));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
};

export async function fetchScenario(id) {
    return fetchDocument('scenarios/' + id);
};
