import { initializeApp } from 'firebase/app';
import { query, where, getFirestore, collection, getDocs } from "firebase/firestore";
export { queryById };

const firebaseConfig = {
    apiKey: "AIzaSyB7xMaHBqOvZ1NkcYXWa6Lv1U2_OW6BLxg",
    authDomain: "localise-aquamarine.firebaseapp.com",
    projectId: "localise-aquamarine",
    storageBucket: "localise-aquamarine.appspot.com",
    messagingSenderId: "223470847695",
    appId: "1:223470847695:web:cbae6e2c4bd026bdc899ba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// A Firebase App is a container-like object that stores common configuration 
// and shares authentication across Firebase services. After you initialise
// a Firebase App object in your code, you can add and start using Firebase services.

/*
async function getDialogue(db) {
    const dialogueStatesCollection = collection(db, 'dialogue_states');
    const dialogueSnapshot = await getDocs(dialogueStatesCollection);
    const dialogueList = dialogueSnapshot.docs.map(doc => doc.data());
    return dialogueList;
}
*/

/*
function dialogueObject(id, icon, text, options) {
    this.id = id; // unique identifier that can be used as query text
    this.icon = icon; // string (emoji)
    this.text = text; // string - NPC's opening line
    this.options = options; // map - each 'option' has two key-value pairs - nextState: string, text: string.
}
*/

async function queryById(col, id) {
    // create a query object where you define how the collection will be filtered
    const q = query(collection(db, col), where("id", "==", id));
    // asynchronously get the documents from the filtered collection
    const querySnapshot = await getDocs(q);
    // do whatever you fancy with the documents

    //console.log(querySnapshot.docs[0].data());
    return querySnapshot.docs[0].data();

    /* EXAMPLE USAGE...
    querySnapshot.forEach((doc) => {
        console.log(doc.data().text, " => ", doc.data().icon);
    });
    */
}

queryById("dialogue_states", "bank1");

/*
getDialogue(db).then(
    function(value) {
        const sampleDialogueObject = new dialogueObject(value[0].id, value[0].icon, value[0].text, value[0].options)
    }
);
*/


