import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ScenarioList.module.css';
import scenarioStyles from './Scenario.module.css';
import { fetchScenarios } from '../backendService';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className={styles.scenarioList}>
      <h1 className={styles.title}>Select a Scenario</h1>


      <Oracle speech="Hello, I am the Oracle. I will guide you through your journey. Select a scenario and dive in! 🤿

" />
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

export function Oracle(props) {
  const [isOpen, setIsOpen] = useState(false)
  const { speech } = props;

  const style = { position: 'absolute', right: 20, bottom: 20, fontSize: 20 };
  if (!isOpen) {
    return (
      <div style={{
        ...style,
        border: '1px solid',
        padding: '10px',
        borderRadius: '5px'
      }} onClick={() => setIsOpen(true)}>
        Get help from oracle 🆘
      </div>
    );
  }

  return (
    <div style={style} >
      <p className={[scenarioStyles.speech, scenarioStyles.oracle].join(" ")}>
        {speech}
      </p>
      <div onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: -10, right: 0 }}>❌</div>
    </div>
  );
}

export default ScenarioList;