import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Scenario.module.css';
import { fetchScenario } from '../backendService';
// import exampleScenario from './scenario.json';

// Determines distances from the initial scene to all other scenes
// This is used to determine the progress of the user
// and relies on all scenarios having a single initial scene and a single ending scene
function determineSceneDistances(scenes, initialStateId) {
  let distances = {};
  let queue = [{ id: initialStateId, distance: 0 }];

  while (queue.length > 0) {
    let { id, distance } = queue.shift();
    if (distances[id] === undefined || distance > distances[id]) {
      distances[id] = distance;
      const scene = scenes.find(scene => scene.id === id);
      scene.options.forEach(option => {
        if (option.nextScene == scene.id) throw new Error(`Scene ${id} has an option that loops back to the same scene`);

        if (
          (!scene.mustBeCorrect && !option.nextScene)
          ||
          (scene.mustBeCorrect && option.isCorrect && !option.nextScene)
        ) throw new Error(`Scene ${id} has an option without a next scene`);

        if (!scene.mustBeCorrect || scene.mustBeCorrect && option.isCorrect) {
          queue.push({ id: option.nextScene, distance: distance + 1 });
        }
      });
    }
  }

  return [distances, Math.max(...Object.values(distances))];
}

const Scenario = () => {
  let { id } = useParams();
  let navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSceneId, setCurrentSceneId] = useState(undefined);
  const [data, setData] = useState({});
  const [scenesCompleted, setScenesCompleted] = useState(0);
  const scenes = data.scenes || [];
  const currentScene = scenes.find(scene => scene.id === currentSceneId);

  const distance = data.distances ? data.distances[currentSceneId] : -1;
  const maxDistance = data.maxDistance || -1;

  useEffect(() => {
    setLoading(true);

    fetchScenario(id)
      .then(data => {
        if (!data) {
          setError('No data returned from backend');
          setLoading(false);
          return;
        }

        const [distances, maxDistance] = determineSceneDistances(data.scenes, data.initialStateId);

        // Randomize the order of the options
        data.scenes.forEach(scene => {
          if (scene.options) {
            scene.options.sort(() => Math.random() - 0.5);
          }
        });

        setData({
          distances,
          maxDistance,
          scenes: data.scenes
        });
        setCurrentSceneId(data.initialStateId)
      })
      .finally(() => {
        // setError(err);
        setLoading(false);
      });

  }, [id]);

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.exitButton}>
        x
      </button>

      {error && error.toString()}
      {loading && <p>Loading...</p>}
      {
        (!loading && currentScene) &&
        <div>
          <p>Scenario: {id}</p>
          <p>Progress {distance}/{maxDistance}</p>
          <Scene
            id={id}
            currentScene={currentScene}
            moveToScene={(sceneId) => {
              setScenesCompleted((v) => ++v);
              setCurrentSceneId(sceneId)
            }}
          />
        </div>
      }
    </div>
  );
};

function Scene({
  currentScene,
  moveToScene
}) {
  const [goodFeedback, setGoodFeedback] = useState('');
  const [badFeedback, setBadFeedback] = useState('');
  const [clickedOption, setClickedOption] = useState(undefined);
  const handleOptionClick = (option) => {
    setClickedOption(option);
  };

  const handleCheckClick = () => {
    if (!clickedOption) return;

    if (!currentScene.mustBeCorrect || (currentScene.mustBeCorrect && clickedOption.isCorrect)) {
      setGoodFeedback(clickedOption.feedback);
      setBadFeedback("");
      moveToScene(clickedOption.nextScene);
      setClickedOption(undefined);
    } else {
      setBadFeedback(clickedOption.feedback);
    }
  }

  return <>
    {goodFeedback && <p>✅ {goodFeedback}</p>}
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
    {currentScene.options.length > 0 && <button disabled={!clickedOption} className={styles.mcqCheck} onClick={handleCheckClick}>Check</button>}
    {badFeedback && <p>❌ {badFeedback}</p>}
  </>
}

export default Scenario;
