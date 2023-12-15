import React, { useState } from "react";
import styles from "../pages/Scenario.module.css";

import { images } from '../lib/assetLibrary';

const oracleImageURL = images.ORACLE_DEFAULT;


export const Slides = (props) => {
  const {slides, slideIndex, onChangeSlide, onComplete} = props;

  const isAfterLastSlide = slideIndex > slides.length - 1;
  const isFirstSlide = slideIndex === 0;

  console.log(slideIndex, slides.length, isAfterLastSlide);

  const slide = slides[slideIndex];

  const nextSlide = () => {
    onChangeSlide?.(Math.min(slideIndex + 1, slides.length));
  };
  const previousSlide = () => {
    onChangeSlide?.(Math.max(slideIndex - 1, 0));
  };
  const finishSlides = () => {
    onComplete?.();
  }


  if (isAfterLastSlide) {
    return (
      <div>
        <div className={styles.slideContainer}>
          <h2>Question time!</h2>
          <img src={oracleImageURL} className={styles.character} alt="character" />
          <p className={[styles.speech, styles.challenge].join(" ")}>If you're ready for an adventure with <b>question time</b> then jump in!</p>
        </div>
        <div className={styles.slideButtonContainer}>
          <button className={[styles.ctaButton, styles.challenge].join(" ")} onClick={previousSlide}>Back</button>
          <button className={[styles.ctaButton, styles.challenge].join(" ")} onClick={finishSlides}>Go!</button>
        </div>
      </div>
    );
  }



  return <div>
    <div className={styles.slideContainer}>
      <h2>Listen up!</h2>
      {slide.imageURL && <img src={slide.imageURL} className={styles.slideImage} alt="slide image" />}
      <p>{slide.text}</p>
    </div>
    <div className={styles.slideButtonContainer}>
      {!isFirstSlide && <button className={[styles.ctaButton, styles.challenge].join(" ")} onClick={previousSlide}>Back</button>}
      <button className={[styles.ctaButton, styles.challenge].join(" ")} onClick={nextSlide}>Next</button>
    </div>
  </div>;
};
