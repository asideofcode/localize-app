import React, { useState, useEffect } from 'react';
import styles from './SplashScreen.module.css';
import scenarioStyles from './Scenario.module.css';
import { useNavigate } from 'react-router-dom';
import { images } from '../AssetLibrary';
import { Oracle } from './ScenarioList';
const SplashScreen = () => {

  const [proceed, setProceed] = useState(false);
  let navigate = useNavigate();
  const handleStartPress = () => {
    setProceed(true);
    navigate("/scenarios");
  }

  return (
      <div className={styles.splashScreen}>
        <Oracle speech="Hello, I am the Oracle. You can sometimes get help from me by clicking down her." />
        <h1>Localize 🌎</h1>
        <p>Familiarise yourself with your local environment. One day at a time :)</p>
        <img src={images.SPLASHSCREEN}/>
        <div>
          <button
            className={styles.startButton}
            onClick={handleStartPress}>
            Play
          </button>
        </div>
      </div>
  );
};

export default SplashScreen;
