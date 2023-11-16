import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const scenarios = [
  { id: "7G5jd0H02t1Y9fS2xfTd", title: 'Visiting Bath City Centre' },
];

const ScenarioList = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select a Scenario</h1>
      <ul className={styles.list}>
        {scenarios.map((scenario) => (

          <Link key={scenario.id} to={`/scenario/${scenario.id}`} className={styles.link}>
            <li className={styles.listItem}>
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
      <p>an interactive, web-based platform designed to help international students familiarize themselves with their new host countries.</p>
      <div>
        <ScenarioList />
      </div>
    </>
  );
};

export default Home;
