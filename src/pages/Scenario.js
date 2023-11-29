import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Scenario.module.css';
import { fetchScenario, createUser, getPlayerFromFirebase, currentPlayer } from '../backendService';
import character from '../character.svg';
import diamond from '../diamond.svg';
import { useLocalStorage } from "@uidotdev/usehooks";
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
  // const [points, setPoints] = useState(0);
  const [points, setPoints] = useLocalStorage("experience-points", 0);

  const scenes = data.scenes || [];
  const currentScene = scenes.find(scene => scene.id === currentSceneId);
  const [learningText, setLearningText] = useState("") || "No learning text found";

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
          scenes: data.scenes,
        });
        setCurrentSceneId(data.initialStateId)
        setLoading(false);
        setLearningText(data.learning_text);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });

  }, [id]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.progress}>
          <div className={styles.progressBar} >
            <div className={styles.progressBarInner} style={{ width: `${distance / maxDistance * 100}%` }}></div>
          </div>
          <div className={styles.progressText}>{distance} / {maxDistance}</div>
        </div>

        <div className={styles.points}>
          <img src={diamond} className={styles.pointsIcon} alt="diamond" />{points}
        </div>

      </div>
      <div className={styles.card}>
        <button onClick={() => navigate('/')} className={styles.exitButton}>
          x
        </button>
        {error && error.toString()}
        {loading && <p>Loading...</p>}
        {
          (!loading && currentScene) &&
          <div>
            <p>Scenario: {id}</p>
            <Scene
              id={id}
              currentScene={currentScene}
              correctAnswer={(clickedOption) => {
                setPoints(points + 10);
                setCurrentSceneId(clickedOption.nextScene)
              }}
              wrongAnswer={() => {
                setPoints(points - 2);
              }}
            />
          </div>
        }
      </div>
    </div>
  );
};

function Scene({
  currentScene,
  correctAnswer,
  wrongAnswer
}) {
  const [goodFeedback, setGoodFeedback] = useState('');
  const [badFeedback, setBadFeedback] = useState('');
  const [clickedOption, setClickedOption] = useState(undefined);
  const handleOptionClick = (option) => {
    setClickedOption(option);
  };

  const handleCheckClick = () => {

    //---------------For testing-----------------------
    //createUser("example@example.com","123456"); //Working!
    // const playerPromise = getPlayerFromFirebase("example@example.com").then((playerPromise) => {
    //   console.log(playerPromise); 
    // }
    // );
    //-------------------------------------------------

    if (!clickedOption) return;

    if (!currentScene.mustBeCorrect || (currentScene.mustBeCorrect && clickedOption.isCorrect)) {

      setGoodFeedback(clickedOption.feedback);
      //Place appropriate xp and/or monetary rewards here by calling currentPlayer's methods.
      setBadFeedback("");

      correctAnswer(clickedOption);
      setClickedOption(undefined);
    } else {
      wrongAnswer(clickedOption);
      setBadFeedback(clickedOption.feedback);
    }
  }

  if (goodFeedback) {
    return <>
      <div>
        <img src={character} className={styles.character} alt="character" />
        <p class={[styles.speech].join(" ")}>{goodFeedback}</p>
      </div>

      {currentScene.options.length > 0 && <button className={styles.mcqCheck} onClick={() => setGoodFeedback(null)}>Next</button>}
    </>
  }

  return <>
    {goodFeedback && <p>✅ {goodFeedback}</p>}
    <div>
      <img src={character} className={styles.character} alt="character" />
      <p class={[styles.speech].join(" ")}>{currentScene.narrative}</p>
    </div>

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
