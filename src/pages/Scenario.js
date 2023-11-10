import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Scenario.module.css';

const Scenario = () => {
  let { id } = useParams();
  let navigate = useNavigate();
  const scenarioText = `Scenario ${id} content...`;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.exitButton}>
        X
      </button>
      <h1>Scenario {id}</h1>
      <p>{scenarioText}</p>
    </div>
  );
};

export default Scenario;
