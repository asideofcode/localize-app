import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { images } from '../AssetLibrary';

const SplashScreen = () => {

  const [proceed, setProceed] = useState(false);
  let navigate = useNavigate();
  const handleStartPress = () => {
    setProceed(true);
    navigate("/scenarios");
  }

  return (
    <>
      <div>
        <div className={styles.container}>
          <h1>Welcome to Localise!</h1>
          <img 
            src={images.SPLASHSCREEN}/>
          <div className={styles.selectionArea}>
            <button
              className={styles.startButton}
              onClick={handleStartPress}>
              Start
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
