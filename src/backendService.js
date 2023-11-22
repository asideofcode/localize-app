import { initializeApp } from 'firebase/app';
import { getFirestore, getDoc, collection, query, getDocs, limit, startAfter, doc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Player } from './Player';


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
export var currentPlayer = new Player("", "");
  
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

export async function updateUserData(email, field, value) {
    
    const userRef = doc(db, "players", email);
    switch (field.toString()) {
        case "money" :
            await updateDoc(userRef, { money: parseInt(value) });        
            break;
        case "xp" :
            await updateDoc(userRef, { xp: parseInt(value) });        
            break;
    }
    
}

export async function createUser(email, password) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const player = new Player(
                user.email,
                user.displayName,
            )
            addPlayerToFirestore(player);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + " || " + errorMessage);
        });
}

async function addPlayerToFirestore(player) {
    console.log("Player being added to firestore...");
    await setDoc(doc(db, "players", player.email), {
        email: player.email,
        username: player.username,
        xp: 0,
        money: 0,
    }).then(
        console.log("Successfully added player to firestore")
    );
}

export async function getPlayerFromFirebase(email) {
    const docRef = doc(db, "players", email).withConverter(playerConverter);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        currentPlayer = docSnap.data();
        return currentPlayer;
    } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    }
}

// Firestore data converter
const playerConverter = {
    toFirestore: (player) => {
        return {
            email: player.email,
            username: player.username,
            money: player.money,
            xp: player.xp,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        currentPlayer.email = data.email;
        currentPlayer.username = data.username;
        currentPlayer.money = data.money;
        currentPlayer.xp = data.xp;
        console.log("Current player : " + currentPlayer);
        return currentPlayer;
    }
};


