import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Scenario.module.css';

const scenarioData = [
  {
    id: 'arrival',
    mustBeCorrect: false,
    narrative: "You've just arrived at Bath Spa Railway Station, excited to explore this historic city. Where would you like to go first?",
    options: [
      { text: "Head straight to the Roman Baths.", nextScene: 'romanBaths', feedback: "Great choice! The Roman Baths are a testament to the city's ancient history." },
      { text: "Visit the Bath Abbey.", nextScene: 'bathAbbey', feedback: "Bath Abbey, with its stunning architecture, is a sight to behold!" },
      { text: "Take a leisurely walk along the River Avon.", nextScene: 'riverAvon', feedback: "Walking by the River Avon offers a picturesque view of Bath." }
    ],
  },
  {
    id: 'romanBaths',
    mustBeCorrect: true,
    narrative: "At the Roman Baths, you're fascinated by the ancient Roman architecture. A guide asks if you know when the Baths were constructed. What's your answer?",
    options: [
      { text: "In the 1st Century AD.", nextScene: 'lunchtime', feedback: "Correct! The Roman Baths date back to around 70 AD.", isCorrect: true },
      { text: "During Medieval times.", nextScene: 'lunchtime', feedback: "Actually, they're much older, dating back to around 70 AD." },
      { text: "In the Victorian era.", nextScene: 'lunchtime', feedback: "Not quite. The Baths were actually built by the Romans around 70 AD." }
    ],
  },
  {
    id: 'bathAbbey',
    narrative: "Next, you visit the majestic Bath Abbey. You're curious about its history. Remember, you're a broke student. Do you:",
    mustBeCorrect: true,
    options: [
      { text: "Ask a tour guide about the Abbey's history.", nextScene: 'lunchtime', feedback: "The tour guide asks you to purchase their 500 pound tour package. You swiftly walk away." },
      { text: "Read the informational plaques near the entrance.", nextScene: 'lunchtime', feedback: "The plaques provide a concise overview of the Abbey's rich history.", isCorrect: true },
      { text: "Join a group of tourists listening to a historian.", nextScene: 'lunchtime', feedback: "The historian notices you and stops mid-sentence, and say 'Can I help you?'. You realise that's not a good thing. You swiftly walk away" }
    ],
  },
  {
    id: 'riverAvon',
    narrative: "You decide to end your day with a peaceful walk along the River Avon. As you walk, you see a boat tour about to start. Do you:",
    mustBeCorrect: false,
    options: [
      { text: "Join the boat tour to see Bath from the river.", nextScene: 'conclusion', feedback: "The boat tour offers a unique perspective of Bath's landmarks from the water." },
      { text: "Continue your walk, enjoying the riverside scenery.", nextScene: 'conclusion', feedback: "Your walk along the river is serene, with beautiful views of the city." },
      { text: "Sit by the river and watch the world go by.", nextScene: 'conclusion', feedback: "Sitting by the river, you soak in the tranquil atmosphere and beautiful views." }
    ],
  },
  {
    id: 'lunchtime',
    narrative: "It's lunchtime! Bath has a variety of dining options. Where do you decide to eat?",
    mustBeCorrect: false,
    options: [
      { text: "Try the local delicacy, Bath Buns, at a traditional bakery.", nextScene: 'riverAvon', feedback: "Delicious choice! Bath Buns are a sweet treat unique to the city." },
      { text: "Have a quick meal at a modern café.", nextScene: 'riverAvon', feedback: "A modern café offers a quick and tasty meal to refuel your energy." },
      { text: "Enjoy a picnic in the Parade Gardens.", nextScene: 'riverAvon', feedback: "Relaxing in the Parade Gardens is a perfect way to enjoy your lunch with a view." }
    ],
  },
  {
    id: 'conclusion',
    narrative: "Your day in Bath has been filled with historical wonders, cultural insights, and delightful experiences. As the sun sets, you reflect on the memories made in this charming city.",
    options: []
  }
];


const Scenario = () => {
  let { id } = useParams();
  let navigate = useNavigate();


  const [currentSceneId, setCurrentSceneId] = useState(scenarioData[0].id);
  const [lastFeedback, setLastFeedback] = useState('');
  const [clickedOption, setClickedOption] = useState(undefined);

  const currentScene = scenarioData.find(scene => scene.id === currentSceneId);

  const handleOptionClick = (option) => {
    setClickedOption(option);
  };

  const handleCheckClick = () => {
    if (!clickedOption) return;

    setLastFeedback(clickedOption.feedback);

    if (!currentScene.mustBeCorrect || (currentScene.mustBeCorrect && clickedOption.isCorrect)) {
      setCurrentSceneId(clickedOption.nextScene);
      setClickedOption(undefined);
    }
  }

  return (
    <div className={styles.container}>
      Scenario: {id}
      <button onClick={() => navigate('/')} className={styles.exitButton}>
        x
      </button>

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
    </div>
  );
};


export default Scenario;
