import { useState, useEffect, useCallback } from 'react';


export const useTimer = (initialTime, onDone) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  const decreaseTime = () => {
    if (timeLeft === 0) {
      // Timer is done
      setTimerRunning(false);
      setTimeLeft(initialTime);
      setTimerDone(true);
      return;
    }

    setTimeLeft(timeLeft - 1);
  };

  useEffect(() => {
    if (timerPaused) {
      return;
    }

    let timeout;
    if (timerRunning) {
      timeout = setTimeout(decreaseTime, 1000);
    }
    return () => clearTimeout(timeout);
  }, [timeLeft, timerRunning, timerPaused]);

  const startTimer = useCallback(() => {
    if (timerPaused) {
      setTimerPaused(false);
      return;
    }

    setTimerRunning(true);
    setTimeLeft(initialTime); // Reset the time when starting the timer
  }, [initialTime, timerPaused]);

  const pauseTimer = () => {
    setTimerPaused(true);
  };

  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setTimerRunning(false);
    setTimerDone(false);
    setTimerPaused(false);
  }, [initialTime]);


  return { timeLeft, timerDone, startTimer, pauseTimer, resetTimer, timerRunning };
};
