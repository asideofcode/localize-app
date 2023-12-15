import React, {useState} from "react";
import styles from "../pages/Scenario.module.css";
import useSound from "use-sound";

export const SoundPlayer = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const [playSound, { stop: stopSound }] = useSound(props.soundURL, {
    onplay: () => setIsPlaying(true),
    onstop: () => setIsPlaying(false),
    onend: () => setIsPlaying(false),
  });


  return (
    <div className={styles.soundPlayerContainer}>
      {!isPlaying ?
        <div onClick={() => playSound()}>🔊 Click to listen</div> :
        <div onClick={() => stopSound()}>🗣️ Speaking ...</div>}
    </div>
  );
};
