import { initializeApp } from 'firebase/app';
import { getFirestore, getDoc, collection, query, getDocs, limit, startAfter, doc } from "firebase/firestore";

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

export async function fetchScenario(id) {
    const docRef = doc(db, 'scenarios', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
};

export async function fetchScenarios(pageSize = 10, startAfterDoc = null) {
    const scenariosRef = collection(db, 'scenarios');
    let q = query(scenariosRef, limit(pageSize));

    // If startAfterDoc is provided, modify the query to start after that document
    if (startAfterDoc) {
        q = query(scenariosRef, startAfter(startAfterDoc), limit(pageSize));
    }

    const querySnapshot = await getDocs(q);
    const scenarios = [];
    let lastVisible = null;

    querySnapshot.forEach((doc) => {
        scenarios.push({ id: doc.id, ...doc.data() });
        lastVisible = doc;
    });

    return { scenarios, lastVisible };
};
