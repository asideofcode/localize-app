import React from "react";
import styles from "../pages/Scenario.module.css";

export const MultipleChoiceOption = (props) => {
  return (
    <button disabled={props.wasWrong} onClick={() => {
      if (props.wasWrong) {
        return;
      }

      props.onClick(props.option);
    }}
      className={`${styles.mcqChoice} ${props.selected ? styles.active : ''}`}
    >
      {props.option?.text}
    </button>
  );
};
