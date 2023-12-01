import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { fetchScenarios } from '../backendService';
import { images } from '../AssetLibrary';

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

/*
const SplashScreen = () => {
    const [proceed, setProceed] = useState(false);
    let navigate = useNavigate();

  return (
      <div className={styles.container}>
          <h1>Welcome to Localise!</h1>
          <div className={styles.selectionArea}>
              <button
                  className={styles.startButton}
                  onClick={setProceed(true)}>
                  Start
              </button>
          </div>
      </div>
  );
};
*/


const Home = () => {

  const [proceed, setProceed] = useState(false);
  const [visible, setVisible] = useState(true);
  const handleStartPress = () => {
    setVisible(false);
    setProceed(true);
  }

  return (
    <>
      <div>
        {visible &&
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
        }
        {proceed && <ScenarioList />}
      </div>
    </>
  );
};

export default Home;
