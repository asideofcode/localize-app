import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const scenarios = [
  { id: 1, title: 'Public Transportation Navigation' },
  { id: 2, title: 'Dialog' },
  { id: 3, title: 'Coffee Shop' },
  // Add more scenarios here
];

const ScenarioList = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select a Scenario</h1>
      <ul className={styles.list}>
        {scenarios.map((scenario) => (

          <Link to={`/scenario/${scenario.id}`} className={styles.link}>
            <li key={scenario.id} className={styles.listItem}>
              {scenario.title}
            </li>
          </Link>

        ))}
      </ul>
    </div >
  );
};


const Home = () => {
  return (
    <>
      <h1>localize</h1>
      <p>Helping you figure out your locale through fun and challenging exercises</p>
      <div>
        <ScenarioList />
      </div>
    </>
  );
};

export default Home;
