import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, unstable_usePrompt } from 'react-router-dom';
import styles from './Scenario.module.css';
import { fetchScenario } from '../lib/backendService';

import diamond from '../images/diamond.svg';
import { useLocalStorage } from "@uidotdev/usehooks";
import useSound from 'use-sound';

import correctSound from '../sounds/correctAnswer.mp3';
import wrongSound from '../sounds/wrongAnswer.mp3';
import { useOracle } from '../components/Oracle';

import { useTimer } from '../hooks/useTimer';
import { Slides } from '../components/Slides';
import { processScenes } from '../lib/processScenes';
import { Scene } from '../components/Scene';



const sections = {
  SLIDES: 'slides',
  MCQ: 'mcq',
  COMPLETE: 'complete'
};

const Scenario = () => {
  unstable_usePrompt({
    message: "Are you sure?",
    when: true
  });

  let { id } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
  const timed = searchParams.get('timed') === 'true';

  let { timeLeft, timerDone, timerPaused, startTimer, timerRunning, pauseTimer } = useTimer(2 * 60);

  useEffect(() => {
    if (timerDone || !timed || timerPaused || timerRunning) {
      return
    }

    startTimer();
  }, [timed, startTimer, timerRunning, timerDone, timerPaused]);

  const [playCorrectSound, { stopCorrectSound }] = useSound(correctSound);
  const [playWrongSound, { stopWrongSound }] = useSound(wrongSound);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState({});

  const [currentSceneId, setCurrentSceneId] = useState(undefined);
  const [section, setSection] = useState(sections.SLIDES);
  const [slideIndex, setSlideIndex] = useState(0);


  // TODO: for using search params
  // const updateSearchParams = (newParams) => {
  //   setSearchParams((oldParams) => {
  //     Object.keys(newParams).forEach(key => {
  //       oldParams.set(key, newParams[key]);
  //     });
  //     return oldParams;
  //   });
  // }
  // const currentSceneId = searchParams.get('currentSceneId');
  // const  setCurrentSceneId = (v) => { updateSearchParams({currentSceneId:  v }); };
  // const section = searchParams.get('section');
  // const  setSection = (v) => { updateSearchParams({section:  v }); };
  // const slideIndex = parseInt(searchParams.get('slideIndex')) || 0;
  // const  setSlideIndex = (v) => { updateSearchParams({slideIndex:  v }); };

  const [points, setPoints] = useLocalStorage("experience-points", 0);
  const [lostPoints, setLostPoints] = useState(0);
  const [gainedPoints, setGainedPoints] = useState(0);

  const scenes = data.scenes || [];
  const currentScene = scenes.find(scene => scene.id === currentSceneId);

  let distance, maxDistance;
  if (section === sections.SLIDES) {
    maxDistance = data.slides ? data.slides.length - 1 : -1;
    distance = Math.min(slideIndex, maxDistance);
  } else if (section === sections.MCQ) {
    distance = data.distances ? data.distances[currentSceneId] : -1;
    maxDistance = data.maxDistance || -1;
  } else {
    distance = maxDistance = data.maxDistance || -1;
  }


  // useEffect(() => {
  //   if (!data.loaded) return;

  //   const newParams = {currentSceneId, section, slideIndex};

  //   Object.keys(newParams).forEach(key => {
  //     if (newParams[key] === undefined) {
  //       delete newParams[key];
  //     }
  //   });

  //   setSearchParams(newParams);
  // }, [data, currentSceneId, section, slideIndex]);

  useOracle("You got this! 🤿");

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

        const [distances, maxDistance, imageURLs, soundURLs] = processScenes(data.scenes, data.initialStateId);

        // Randomize the order of the options
        data.scenes.forEach(scene => {
          if (scene.options) {
            scene.options.sort(() => Math.random() - 0.5);
          }
        });

        const slides = data.learning_slides || [];

        // TODO: preload sounds
        // Preload images
        imageURLs.forEach(imageURL => {
          const img = new Image();
          img.src = imageURL;
        });
        slides.forEach((slide) => {
          const img = new Image();
          img.src = slide.imageURL;
        });
        setData({
          loaded: true,
          distances,
          maxDistance,
          scenes: data.scenes,
          slides: slides
        });

        // TODO: for using search params
        // let sceneId = parseInt(searchParams.get('currentSceneId'));
        // if (!data.scenes.some(scene => scene.id === sceneId)) {
        //   setCurrentSceneId(data.initialStateId);
        // }

        // // Reset slide index or use search param
        // let slideIndex = parseInt(searchParams.get('slideIndex'));
        // if (!(slideIndex > 0 && slideIndex < slides.length)) {
        //   setSlideIndex(0);
        // }

        // if (!(searchParams.get('section') in sections)) {
        //   setSection(sections.SLIDES);
        // }

        setCurrentSceneId(data.initialStateId);
        setSlideIndex(0);
        setSection(sections.SLIDES);
      })
      .catch(err => {
        setError(err);
      }).finally(() => {
        setLoading(false);
      });

  }, [id]);


  let content = null;
  if (timed && timerDone) {
    content = <div>
      <h2>Time's up!</h2>
      <p>Tough luck, time ran out. Try again tomorrow :)</p>
    </div>
  } else if (section == sections.SLIDES) {
    content = <Slides
      slideIndex={slideIndex}
      slides={data.slides}
      onChangeSlide={(index) => {
        playCorrectSound();
        setSlideIndex(index);
      }}
      onComplete={() => {
        setSection(sections.MCQ);
      }}
    />
  } else if (section == sections.MCQ) {
    content = <Scene
      id={id}
      currentScene={currentScene}
      correctAnswer={(nextScene) => {
        setPoints(points + 10);
        setGainedPoints(gainedPoints + 10);
        setCurrentSceneId(nextScene)
        playCorrectSound();
      }}
      wrongAnswer={(clickedOption) => {
        setPoints(points - 2);
        setLostPoints(lostPoints + 2);
        playWrongSound();
      }}
      onComplete={() => {
        pauseTimer();
        setSection(sections.COMPLETE);
      }}
    />
  } else if (section == sections.COMPLETE) {
    content = <div>
      <h2>All done 🎉!</h2>
      <p>Great work finishing the scenario today! Look at all the XP points you gained.</p>
      <p>Today you <b>gained {gainedPoints} XP points</b>, and <b>lost {lostPoints} points.</b></p>
      {timed && <p>You finished with {timeLeft}s left on the clock.</p> }
      <p>Check back in tomorrow for the next scenario.</p>
    </div>
  }
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
      {
        timed &&
        <div className={styles.timer}>
          {
            timerRunning ?
              <p>⏰ {timeLeft}s left</p> :
              <p>Time's up!</p>
          }
        </div>
      }

      <div className={styles.scenario}>
        {error && error.toString()}
        {loading && <div className={styles.loading}>Loading...</div>}
        {
          (!loading && currentScene) &&
          <div>
            {content}
          </div>
        }
      </div>
    </div >
  );
};

export default Scenario;
