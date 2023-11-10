import React, { useState } from 'react';
import styles from './CoffeeOrderScenario.module.css';
import { useNavigate } from 'react-router-dom';

const CoffeeOrderScenario = () => {
    const [coffeeType, setCoffeeType] = useState('');
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    let navigate = useNavigate();

    const handleCoffeeSelection = (type) => {
        setCoffeeType(type);
        setOrderConfirmed(false); // Reset order confirmation on new selection
    };

    const confirmOrder = () => {
        if (coffeeType) {
            setOrderConfirmed(true);
        } else {
            alert('Please select a type of coffee first.');
        }
    };

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} className={styles.exitButton}>
                X
            </button>
            <h1>Welcome to the Local Café!</h1>
            <p>Please select the type of coffee you would like to order:</p>
            <div className={styles.selectionArea}>
                <button
                    className={styles.coffeeButton}
                    onClick={() => handleCoffeeSelection('Americano')}
                >
                    Americano
                </button>
                <button
                    className={styles.coffeeButton}
                    onClick={() => handleCoffeeSelection('Espresso')}
                >
                    Espresso
                </button>
                <button
                    className={styles.coffeeButton}
                    onClick={() => handleCoffeeSelection('Cappuccino')}
                >
                    Cappuccino
                </button>
            </div>
            <p>You have selected: <strong>{coffeeType || 'None'}</strong></p>
            <button
                className={styles.confirmButton}
                onClick={confirmOrder}
            >
                Confirm Order
            </button>
            {orderConfirmed && <p className={styles.confirmationMessage}>Thank you! Your order has been confirmed.</p>}
        </div>
    );
};

export default CoffeeOrderScenario;
