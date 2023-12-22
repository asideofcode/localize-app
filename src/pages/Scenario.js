import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, unstable_usePrompt } from 'react-router-dom';
import styles from './Scenario.module.css';
import { fetchScenario } from '../lib/backendService';
import { CSSTransition } from 'react-transition-group';

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

  const [points, _setPoints] = useLocalStorage("experience-points", 0);
  const [lostPoints, setLostPoints] = useState(0);
  const [gainedPoints, setGainedPoints] = useState(0);
  const [pointsInProp, setPointsInProp] = useState(false);

  const setPoints = (...rest) => {
    setPointsInProp(false);
    setTimeout(() => {
      _setPoints(...rest); // Change number after exit animation
      setPointsInProp(true); // Trigger enter animation
    }, 500);
  }

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
       
        slides.forEach((slide) => {
          imageURLs.add(slide.imageURL);
        });
        imageURLs.forEach(imageURL => {
          if (!imageURL) return;
          var link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = imageURL;
          document.head.appendChild(link);
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
      {timed && <p>You finished with {timeLeft}s left on the clock.</p>}
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


        <CSSTransition in={pointsInProp} timeout={200} classNames="points">
          <div className={styles.points}>
            <PointsDiamond />
            {points}
          </div>
        </CSSTransition>

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


const PointsDiamond = (props) => {
  return <div className={styles.pointsIcon} alt="diamond">
    <svg fill="#F44336" height="100%" width="100%"
      viewBox="0 0 64 64" enable-background="new 0 0 64 64" >
      <path id="Diamond" d="M63.6870499,18.5730648L48.7831497,4.278266c-0.1855011-0.1758003-0.4316025-0.4813001-0.6870003-0.4813001
 H15.9037514c-0.2553005,0-0.5014,0.3054998-0.6870003,0.4813001l-14.9038,14.1908998
 c-0.374,0.3535004-0.4184,0.9855995-0.1025,1.3917999c0.21,0.2703991,30.8237991,39.7256012,31.0517006,39.9812012
 c0.1022987,0.1149979,0.2402992,0.2215996,0.3428001,0.266098c0.2763996,0.1206017,0.5077,0.1296997,0.7900982,0.0065002
 c0.1025009-0.0444984,0.2404022-0.1348991,0.3428001-0.2499008c0.0151024-0.0168991,0.0377007-0.0224991,0.0517006-0.0404968
 L63.789547,19.9121666C64.1054459,19.5058651,64.0610504,18.9265652,63.6870499,18.5730648z M15.6273508,6.4344659
 l4.9945002,11.3625011H3.6061509L15.6273508,6.4344659z M24.0795517,17.7969666l7.9203987-11.2617006l7.9204979,11.2617006
 H24.0795517z M40.7191467,19.7969666l-8.7191963,34.8769989l-8.719099-34.8769989H40.7191467z M33.9257507,5.7969656h12.5423012
 l-4.8240013,10.9746008L33.9257507,5.7969656z M22.3559513,16.7715664L17.53195,5.7969656h12.5423012L22.3559513,16.7715664z
  M21.2191505,19.7969666l8.6596012,34.638401L2.975451,19.7969666H21.2191505z M42.7808495,19.7969666h18.2436981
 l-26.9032974,34.638401L42.7808495,19.7969666z M43.3781471,17.7969666l4.9944992-11.3625011l12.0212021,11.3625011H43.3781471z"/>
    </svg>
  </div>
}
export default Scenario;
