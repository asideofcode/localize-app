import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Scenario.module.css';
import { fetchScenario } from '../backendService';
// import exampleScenario from './scenario.json';

const ScenarioContainer = () => {
  let { id } = useParams();
  let navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSceneId, setCurrentSceneId] = useState(undefined);
  const [scenes, setScenes] = useState([]);
  const currentScene = scenes.find(scene => scene.id === currentSceneId);

  useEffect(() => {
    setLoading(true);

    fetchScenario('7G5jd0H02t1Y9fS2xfTd')
      .then(data => {
        if (!data) {
          setError('No data returned from backend');
          setLoading(false);
          return;
        }

        setScenes(data.scenes);
        setCurrentSceneId(data.initialStateId)
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });

  }, []);

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.exitButton}>
        x
      </button>

      {error}
      {loading && <p>Loading...</p>}
      {
        (!loading && currentScene) &&
        <Scenario
          id={id}
          currentScene={currentScene}
          moveToScene={(sceneId) => setCurrentSceneId(sceneId)}
        />
      }
    </div>
  );
};

function Scenario({
  id,
  currentScene,
  moveToScene
}) {
  const [lastFeedback, setLastFeedback] = useState('');
  const [clickedOption, setClickedOption] = useState(undefined);
  const handleOptionClick = (option) => {
    setClickedOption(option);
  };

  const handleCheckClick = () => {
    if (!clickedOption) return;

    setLastFeedback(clickedOption.feedback);

    if (!currentScene.mustBeCorrect || (currentScene.mustBeCorrect && clickedOption.isCorrect)) {
      moveToScene(clickedOption.nextScene);
      setClickedOption(undefined);
    }
  }

  return <>
    <p>Scenario: {id}</p>
    <p>{currentScene.narrative}</p>
    <ul className={styles.mcqChoices}>
      {currentScene.options.map((option, index) => (
        <li key={index}>
          <button className={`${styles.mcqChoice} ${option === clickedOption ? styles.active : ''}`} key={index} onClick={() => handleOptionClick(option)}>
            {option.text}
          </button>
        </li>
      ))}
    </ul>
    <button disabled={!clickedOption} className={styles.mcqCheck} onClick={handleCheckClick}>Check</button>
    {lastFeedback && <p>{lastFeedback}</p>}
  </>
}

export default ScenarioContainer;
