import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './ScenarioList.module.css';
import { fetchScenarios } from '../backendService';
import { useNavigate } from 'react-router-dom';
import {useOracle} from '../components/Oracle';

const ScenarioList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    setLoading(true);

    fetchScenarios()
      .then(data => {
        if (!data) {
          setError('No data returned from backend');
          setLoading(false);
          return;
        }

        setScenarios(data.scenarios);
      })
      .catch(err => {
        setError(err);
      }).finally(() => {
        setLoading(false);
      });

  }, []);

  useOracle("Hello, I am the Oracle. I will guide you through your journey. Select a scenario and dive in! 🤿");

  return (
    <div className={styles.scenarioList}>
      <h1 className={styles.title}>Select a Scenario</h1>
      {error && <p>{error}</p>}
      {
        loading ?
          (<p>Loading...</p>) :
          (
            <ul className={styles.list}>
              {scenarios.length == 0 && <p>We're all out of scenarios :(</p>}
              {scenarios.map((scenario) => (

                <Link key={scenario.id} to={`/scenario/${scenario.id}`} className={styles.link}>
                  <li className={styles.listItem}>
                    {scenario.title}
                  </li>
                </Link>

              ))}
            </ul>
          )
      }
    </div >
  );
};

export default ScenarioList;