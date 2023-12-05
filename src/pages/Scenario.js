import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Scenario.module.css';
import { fetchScenario, createUser, getPlayerFromFirebase, currentPlayer } from '../backendService';
import character from '../character.svg';
import diamond from '../diamond.svg';
import { useLocalStorage } from "@uidotdev/usehooks";
import useSound from 'use-sound';

import correctSound from '../sounds/correct answer.mp3';
import wrongSound from '../sounds/wrong answer.mp3';
// import exampleScenario from './scenario.json';

// Determines distances from the initial scene to all other scenes
// This is used to determine the progress of the user
// and relies on all scenarios having a single initial scene and a single ending scene
function determineSceneDistances(scenes, initialStateId) {
  let distances = {};
  let queue = [{ id: initialStateId, distance: 0, visited: new Set([initialStateId]) }];

  while (queue.length > 0) {
    let { id, distance, visited } = queue.shift();

    distances[id] = Math.max(distances[id] || 0, distance);

    const scene = scenes.find(scene => scene.id === id);
    if (scene) {
      scene.options.forEach(option => {
        if ((!scene.mustBeCorrect || (scene.mustBeCorrect && option.isCorrect)) && !visited.has(option.nextScene)) {
          let newVisited = new Set(visited);
          newVisited.add(option.nextScene);
          queue.push({ id: option.nextScene, distance: distance + 1, visited: newVisited });
        }
      });
    }
  }

  return [distances, Math.max(...Object.values(distances))];
}

const sections = {
  SLIDES: 'slides',
  MCQ: 'mcq',
  COMPLETE: 'complete'
};

const Scenario = () => {
  let { id } = useParams();
  let navigate = useNavigate();

  const [playCorrectSound, { stopCorrectSound }] = useSound(correctSound);
  const [playWrongSound, { stopWrongSound }] = useSound(wrongSound);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSceneId, setCurrentSceneId] = useState(undefined);
  const [data, setData] = useState({});
  const [section, setSection] = useState(sections.SLIDES);

  // const [points, setPoints] = useState(0);
  const [points, setPoints] = useLocalStorage("experience-points", 0);

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

        data.scenes.forEach(scene => {
          if (Array.isArray(scene.options)) return;

          console.warn(`Scene ${scene.id} does not have array of options`);
          scene.options = [];
        });

        const [distances, maxDistance] = determineSceneDistances(data.scenes, data.initialStateId);

        // Randomize the order of the options
        data.scenes.forEach(scene => {
          if (scene.options) {
            scene.options.sort(() => Math.random() - 0.5);
          }
        });

        // const slides = [
        //   {
        //     imageUrl: "https://static.vecteezy.com/system/resources/previews/027/148/565/non_2x/yellow-city-bus-passenger-transport-side-view-public-transport-modern-touristic-bus-illustration-vector.jpg",
        //     text: `Taking a bus to school is a good way to save money. But you need to know how to use the bus.`
        //   },
        //   {
        //     imageUrl: "https://thumbs.dreamstime.com/z/terminal-passenger-transport-card-hand-airport-metro-bus-subway-ticket-validator-wireless-contactless-cashless-payments-152800600.jpg?w=768",
        //     text: "At Bath university, you can use the bus by showing your student card or tapping your phone."
        //   },
        //   {
        //     imageUrl: "https://cdn.vectorstock.com/i/1000x1000/16/79/people-getting-off-bus-cartoon-isolated-vector-34071679.webp",
        //     text: "Don't forget to tap your phone when you get off the bus."
        //   }
        // ];
        const slides = data.learning_slides || [];

        // Preload images
        slides.forEach((slide) => {
          const img = new Image();
          img.src = slide.imageURL;
        });
        setData({
          distances,
          maxDistance,
          scenes: data.scenes,
          slides: slides
        });

        setCurrentSceneId(data.initialStateId)
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        window.err = err;
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
        {loading && <div className={styles.loading}>Loading...</div>}
        {
          (!loading && currentScene) &&
          <div>
            {
              section == sections.SLIDES &&
              <Slides
                changeSlide={() => {
                  playCorrectSound();
                }}
                id={id}
                slides={data.slides}
                switchToQuestions={() => {
                  setSection(sections.MCQ);
                }}
              />
            }
            {
              section == sections.MCQ &&
              <Scene
                id={id}
                currentScene={currentScene}
                correctAnswer={(clickedOption) => {
                  setPoints(points + 10);
                  setCurrentSceneId(clickedOption.nextScene)
                  playCorrectSound();
                }}
                wrongAnswer={() => {
                  setPoints(points - 2);
                  playWrongSound();
                }}
                onComplete={() => {
                  setSection(sections.COMPLETE);
                }}
              />
            }
            {
              section == sections.COMPLETE && (
                <div>
                  <h2>Well done!</h2>
                </div>)
            }

          </div>
        }
      </div>
    </div >
  );
};

function Scene({
  currentScene,
  correctAnswer,
  wrongAnswer,
  onComplete
}) {
  const [goodFeedback, setGoodFeedback] = useState(null);
  const [badFeedback, setBadFeedback] = useState(null);
  const [clickedOption, setClickedOption] = useState(undefined);
  const handleOptionClick = (option) => {
    setClickedOption(option);
  };

  const endOfScene = !currentScene.options?.length;

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

      setGoodFeedback({
        message: clickedOption.feedback,
        imageURL: clickedOption.imageURL,
      });
      console.log(clickedOption)
      //Place appropriate xp and/or monetary rewards here by calling currentPlayer's methods.
      setBadFeedback(null);

      correctAnswer(clickedOption);
      setClickedOption(undefined);
    } else {
      wrongAnswer(clickedOption);
      setBadFeedback({
        message: clickedOption.feedback,
        imageURL: clickedOption.imageURL,
      });
    }
  }

  if (goodFeedback) {
    return <>
      <div>
        <img src={character} className={styles.character} alt="character" />
        {
          goodFeedback.imageURL && <img src={goodFeedback.imageURL} className={styles.sceneImage} alt="image" />
        }
        <p className={[styles.speech].join(" ")}>✅ {goodFeedback.message}</p>
      </div>

      {!endOfScene && <button className={styles.ctaButton} onClick={() => setGoodFeedback(null)}>Next</button>}
      {endOfScene && <button className={styles.ctaButton} onClick={onComplete}>Finish</button>}

    </>
  }

  if (badFeedback) {
    return <>
      <div>
        <img src={character} className={styles.character} alt="character" />
        {
          badFeedback.imageURL && <img src={badFeedback.imageURL} className={styles.sceneImage} alt="image" />
        }
        <p className={[styles.speech].join(" ")}>❌ {badFeedback.message}</p>
      </div>

      <button className={styles.ctaButton} onClick={() => setBadFeedback(null)}>Try again</button>

    </>
  }

  return <>
    <h2>Question time!</h2>
    <div>
      <img src={character} className={styles.character} alt="character" />
      {
        currentScene.imageURL && <img src={currentScene.imageURL} className={styles.sceneImage} alt="image" />
      }
      <p className={[styles.speech].join(" ")}>{currentScene.narrative}</p>
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
    {!endOfScene && <button disabled={!clickedOption} className={styles.ctaButton} onClick={handleCheckClick}>Check</button>}
    {endOfScene && <button className={styles.ctaButton} onClick={onComplete}>Finish</button>}
  </>
}

const Slides = (props) => {
  const slides = props.slides;
  const [slideIndex, setSlideIndex] = useState(0);

  const isAfterLastSlide = slideIndex > slides.length - 1;
  const isFirstSlide = slideIndex === 0;

  const slide = slides[slideIndex];

  const onNextSlide = () => {
    setSlideIndex(Math.min(slideIndex + 1, slides.length));
    props.changeSlide?.();
  }
  const onPreviousSlide = () => {
    setSlideIndex(Math.max(slideIndex - 1, 0));
    props.changeSlide?.();
  }

  if (isAfterLastSlide) {
    return (
      <div>
        <h2>Question time!</h2>
        <img src={character} className={styles.character} alt="character" />
        <p className={[styles.speech, styles.challenge].join(" ")}>If you're ready for an adventure with <b>question time</b> then jump in!</p>
        <div className={styles.slideButtonContainer}>
          <button className={[styles.ctaButton, styles.challenge].join(" ")} onClick={onPreviousSlide}>Back</button>
          <button className={[styles.ctaButton, styles.challenge].join(" ")} onClick={() => props.switchToQuestions()}>Go!</button>
        </div>
      </div>
    )
  }



  return <div>
    <h2>Time to learn!</h2>
    {slide.imageURL && <img src={slide.imageURL} className={styles.slideImage} alt="slide image" />}
    <p>{slide.text}</p>
    <div className={styles.slideButtonContainer}>
      {!isFirstSlide && <button className={[styles.ctaButton, styles.challenge].join(" ")} onClick={onPreviousSlide}>Back</button>}
      <button className={[styles.ctaButton, styles.challenge].join(" ")} onClick={onNextSlide}>Next</button>
    </div>
  </div>;
}

export default Scenario;
