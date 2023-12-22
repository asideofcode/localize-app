import React, { useState, useEffect } from 'react';
import styles from './SplashScreen.module.css';
import scenarioStyles from './Scenario.module.css';
import { useNavigate } from 'react-router-dom';
import { images } from '../lib/assetLibrary';
import { useOracle } from '../components/Oracle';
import logo from '../images/logo.png';

const SplashScreen = () => {
  let navigate = useNavigate();

  const handleStartPress = () => {
    navigate("/scenarios");
  }

  useOracle("Hello, I am the Oracle. You can sometimes get help from me by clicking down her.");

  return (
      <div className={styles.splashScreen}>
        <h1>Localize 🌎</h1>
        <p>Familiarise yourself with your local environment!</p>
        <p>We strive to offer scenarios for all skill levels that everyone can enjoy playing every day.</p>
        
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
