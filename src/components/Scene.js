import React, { useState, useEffect } from "react";
import styles from "../pages/Scenario.module.css";
import exampleQuestion from "../sounds/exampleQuestion.mp3";
import { useOracle } from "../components/Oracle";
import { MultipleChoiceOption } from "../components/MultipleChoiceOption";
import { SoundPlayer } from "../components/SoundPlayer";
import { images } from '../lib/assetLibrary';

const oracleImageURL = images.ORACLE_DEFAULT;

export function Scene({
  currentScene, correctAnswer, wrongAnswer, onComplete
}) {
  const [goodFeedback, setGoodFeedback] = useState(null);
  const [badFeedback, setBadFeedback] = useState(null);
  const [clickedOption, setClickedOption] = useState(undefined);
  const [clickedWrongOptions, setClickedWrongOptions] = useState(new Set());
  const handleOptionClick = (option) => {
    setClickedOption(option);
  };

  const { setShowOracle, setOracleSpeech } = useOracle("You got this! 🤿");

  // Hide the oracle when the scene changes
  useEffect(() => {
    if (goodFeedback) {
      setOracleSpeech("See, you got this! 🤿");
    } else {
      setOracleSpeech(currentScene?.hint || "You got this! 🤿");
    }

    setShowOracle(false);

    // TODO: add event listener for when the user clicks on the oracle
  }, [currentScene, goodFeedback]);

  const endOfScene = !currentScene.options?.length;

  const handleCheckClick = () => {

    if (!clickedOption) return;

    if (!currentScene.mustBeCorrect || (currentScene.mustBeCorrect && clickedOption.isCorrect)) {

      setGoodFeedback({
        message: clickedOption.feedback,
        imageURL: clickedOption.imageURL,
      });

      //Place appropriate xp and/or monetary rewards here by calling currentPlayer's methods.
      setBadFeedback(null);

      if (!clickedOption.nextScene) {
        onComplete?.();
        return;
      }

      correctAnswer(clickedOption.nextScene);
      setClickedOption(undefined);
    } else {
      wrongAnswer(clickedOption);

      setClickedWrongOptions(new Set([...clickedWrongOptions, clickedOption]));
  
      setBadFeedback({
        message: clickedOption.feedback,
        imageURL: clickedOption.imageURL,
      });
    }
  };

  if (goodFeedback) {
    return <>
      <div className={styles.sceneContainer}>
        <h2>Yay!</h2>
        <div>
          <img src={oracleImageURL} className={styles.character} alt="character" />
          {goodFeedback.imageURL && <img src={goodFeedback.imageURL} className={styles.sceneImage} alt="image" />}
          <p className={[styles.speech].join(" ")}>✅ {goodFeedback.message}</p>
        </div>
      </div>

      <div className={styles.slideButtonContainer}>
        {!endOfScene && <button className={styles.ctaButton} onClick={() => setGoodFeedback(null)}>Next</button>}
        {endOfScene && <button className={styles.ctaButton} onClick={onComplete}>Finish</button>}
      </div>
    </>;
  }

  if (badFeedback) {
    return <>
      <div className={styles.sceneContainer}>
        <h2>Oops!</h2>
        <div>
          <img src={oracleImageURL} className={styles.character} alt="character" />
          {badFeedback.imageURL && <img src={badFeedback.imageURL} className={styles.sceneImage} alt="image" />}
          <p className={[styles.speech].join(" ")}>❌ {badFeedback.message}</p>
        </div>
      </div>
      <div className={styles.slideButtonContainer}>
        <button className={styles.ctaButton} onClick={() => {
          setBadFeedback(null);
          setClickedOption(undefined);
        }}>Try again</button>
      </div>
    </>;
  }

  return <>
    <div className={styles.sceneContainer}>
      <h2>Question time!</h2>
      <div>
        <img src={oracleImageURL} className={styles.character} alt="character" />
        {currentScene.imageURL && <img src={currentScene.imageURL} className={styles.sceneImage} alt="image" />}
        <div className={[styles.speech].join(" ")}>
          {currentScene.soundURL && <SoundPlayer soundURL={exampleQuestion} />}
          {currentScene.narrative}
        </div>

      </div>

      <ul className={styles.mcqChoices}>
        {currentScene.options.map((option, index) => (
          <li key={index}>
            <MultipleChoiceOption
              selected={option === clickedOption}
              wasWrong={clickedWrongOptions.has(option)}
              onClick={handleOptionClick}
              option={option} />
          </li>
        ))}
      </ul>
    </div>
    <div className={styles.slideButtonContainer}>
      {!endOfScene && <button disabled={!clickedOption} className={styles.ctaButton} onClick={handleCheckClick}>Check</button>}
      {endOfScene && <button className={styles.ctaButton} onClick={onComplete}>Finish</button>}
    </div>
  </>;
}
