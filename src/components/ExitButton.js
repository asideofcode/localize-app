import React from "react";
import { Link } from "react-router-dom";
import styles from "../pages/Scenario.module.css";

export function ExitButton() {
  return (
    <Link to="/">
      <div className={styles.exitButton} style={{ position: 'relative', top: -30, right: -30 }}>
        x
      </div>
    </Link>
  );
}
