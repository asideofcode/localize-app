import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { fetchScenarios } from '../backendService';

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
    <div className={styles.container}>
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


const Home = () => {
  return (
    <>
      <h1>localize</h1>
      <p>an interactive, web-based platform designed to help international students familiarize themselves with their new host countries.</p>
      <div>
        <ScenarioList />
      </div>
    </>
  );
};

export default Home;
