import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useMatch, useLocation } from 'react-router-dom';
import Scenario from './pages/Scenario';
import SplashScreen from './pages/SplashScreen';
import ScenarioList from './pages/ScenarioList';

import './App.css';
import styles from './pages/Scenario.module.css';

import Oracle, { OracleContext } from './components/Oracle';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Container />}>
          <Route index element={<SplashScreen />} />
          <Route path="scenarios" element={<ScenarioList />} />
          <Route path="scenario/:id" element={<Scenario />} />
        </Route>
      </Routes>
    </Router>

  );
};

function Container(props) {
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

function ExitButton() {
  return (
    <Link to="/">
      <div className={styles.exitButton} style={{ position: 'relative', top: -30, right: -30 }} >
        x
      </div>
    </Link>
  );
}



export default App;

