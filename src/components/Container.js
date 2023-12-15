import React, { useState, useEffect } from "react";
import { Outlet, useMatch, useLocation } from "react-router-dom";
import styles from "../pages/Scenario.module.css";
import Oracle, { OracleContext } from "./Oracle";
import { ExitButton } from "./ExitButton";

export function Container(props) {
  const [oracleSpeech, setOracleSpeech] = useState(null);
  const [showOracle, setShowOracle] = useState(null);

  const location = useLocation();
  useEffect(() => {
    setShowOracle(false);
    setOracleSpeech(null);
  }, [location]);

  const matchIndex = useMatch('/');
  return (
    <OracleContext.Provider
      value={{
        oracleSpeech,
        setOracleSpeech,
        showOracle,
        setShowOracle,
      }}
    >
      <div className={styles.card}>
        {!matchIndex && <ExitButton />}
        <Outlet />
        <Oracle showOracle={showOracle} setShowOracle={setShowOracle} speech={oracleSpeech} />
      </div>
    </OracleContext.Provider>
  );
}
