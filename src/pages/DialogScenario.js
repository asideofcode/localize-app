import React, { useState, useEffect } from 'react';
import styles from './DialogScenario.module.css'; // Assume you've created corresponding styles
import { useNavigate, useLocation } from 'react-router-dom';
import { queryById } from '../Firebase.js';

function dialogueObject(id, icon, text, options) {
    this.id = id; // unique identifier that can be used as query text
    this.icon = icon; // string (emoji)
    this.text = text; // string - NPC's opening line
    this.options = options; // map - each 'option' has two key-value pairs - nextState: string, text: string.
}

const greeting1 = new dialogueObject("","","",[])
queryById("dialogue_states", "bank1").then( (it) => {
    greeting1.id = it.id;
    greeting1.icon = it.icon;
    greeting1.text = it.text;
    greeting1.options = it.options;
    console.log(greeting1.text);
});

const dialogStates = {
    greeting: {
        icon: greeting1.icon,
        text: greeting1.text,
        options: [
            //{ text: greeting1.options[0].text, nextState: greeting1.options[0].nextState },
            //{ text: greeting1.options[1].text, nextState: greeting1.options[1].nextState },
            { text: "I'd like to open a new account", nextState: "openAccount" },
            { text: "I need assistance with my current account", nextState: "currentAccountHelp" },
        ],
    },
    openAccount: {
        icon: "😊",
        text: "Great! What type of account would you like to open?",
        options: [
            { text: "Checking account", nextState: "completeForm" },
            { text: "Savings account", nextState: "completeForm" },
        ],
    },
    currentAccountHelp: {
        icon: "🤔",
        text: "Sure, I can help you with that. What do you need assistance with?",
        options: [
            { text: "I lost my card.", nextState: "lostCard" },
            { text: "I forgot my online banking password.", nextState: "resetPassword" },
        ],
    },
    completeForm: {
        icon: "🙏",
        text: "Please fill out this form with your details.",
        // No options if this is the end of the dialog path
    },
    lostCard: {
        icon: "😭",
        text: "We can help you with that. We will cancel your current card and issue a new one.",
        // No options if this is the end of the dialog path
    },
    resetPassword: {
        icon: "🤦",
        text: "No problem, we can reset it. We'll need some additional information for that.",
        // No options if this is the end of the dialog path
    },
    // Add more states as needed
};


const DialogScenario = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const stateFromQuery = queryParams.get('state');

    // Set the current state based on the URL, defaulting to 'greeting'
    const [currentState, setCurrentState] = useState(stateFromQuery || 'greeting');
    const [ddialogStates, setDdialogStates] = useState({});
    const currentDialog = ddialogStates[currentState];


    const handleOptionClick = (nextState) => {
        setCurrentState(nextState);
    };

    useEffect(() => {
        new Promise(res => {
            setTimeout(() => {
                setDdialogStates(dialogStates)
            }, 3000)
        })
    }, []);

    useEffect(() => {
        const handlePopState = (event) => {
            // Check if the state is null (e.g., if the user navigates to a different page and back)
            if (event.state === null) {
                setCurrentState('greeting');
            } else {
                // Set the state from the URL
                const queryParams = new URLSearchParams(window.location.search);
                const stateFromQuery = queryParams.get('state');
                if (stateFromQuery) {
                    setCurrentState(stateFromQuery);
                }
                
            }
        };

        // Listen for popstate event
        window.addEventListener('popstate', handlePopState);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
        }
    }, []);

    useEffect(() => {
        // Push a new entry into the history stack when the state changes
        navigate(`?state=${currentState}`, { replace: false });
    }, [currentState, navigate]);



    return (
        <div className={styles.dialogContainer}>
            <button onClick={() => navigate('/')} className={styles.exitButton}>
                X
            </button>
            <p className={styles.dialogText}><span style={{ fontSize: '50px' }}>{currentDialog.icon}</span> {currentDialog.text}</p>
            {!currentDialog && "Loading"}
            {ccurrentDialog && urrentDialog.options && (
                <div className={styles.optionsContainer}>
                    {currentDialog.options.map((option, index) => (
                        <button
                            key={index}
                            className={styles.optionButton}
                            onClick={() => handleOptionClick(option.nextState)}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DialogScenario;
