import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './ScenarioList.module.css';
import { fetchScenarios, fetchScenario } from '../lib/backendService';
import { useOracle } from '../components/Oracle';

const ScenarioSelection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayScenario, setTodaysScenario] = useState({});

  useEffect(() => {
    setLoading(true);

    // Hard coded scenario id for now, will be replaced with one for the day
    const scenarioId = "Scenario 1 - Welcome and Bus";
    fetchScenario(scenarioId).then((scenario) => {
      scenario.id = scenarioId;
      setTodaysScenario(scenario);
    }).catch(e => {
      console.error(e);
      setError(e.toString());
    }).finally(() => { setLoading(false); });


  }, []);

  useOracle("On this screen you need to select the level of difficulty that you feel comfortable with.");

  return (
    <div className={styles.scenarioList}>
      <h1 className={styles.title}>Feeling confident 😏 ?</h1>
      {error && <p>{error}</p>}
      {
        loading ?
          (<p>Loading...</p>) :
          (
            <>
              <p>Select a difficulty level that suits you. EASY is all text and pictures and HARD has a timer and audio.</p>
              <p>Today's scenario is: <b>{todayScenario.title}</b></p>
              <ul className={styles.list}>
                <Link to={`/scenario/${todayScenario.id}`} className={styles.link}>
                  <li className={[styles.listItem, styles.difficulty].join(" ")}>
                    EASY
                  </li>
                </Link>
                <Link to={`/scenario/${todayScenario.id}?timed=true`} className={styles.link}>
                  <li className={[styles.listItem, styles.difficulty].join(" ")}>
                    HARD
                  </li>
                </Link>
              </ul>
            </>
          )
      }
    </div >
  );
};

export default ScenarioSelection;