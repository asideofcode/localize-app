// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scenario from './pages/Scenario';
import CoffeeOrderScenario from './pages/CoffeeOrderScenario';
import DialogScenario from './pages/DialogScenario';
import SplashScreen from './pages/SplashScreen';
import ScenarioList from './pages/ScenarioList';

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/scenarios" element={<ScenarioList />} />
        <Route path="/scenario/:id" element={<Scenario />} />
        {/* <Route path="/scenario/3" element={<CoffeeOrderScenario />} /> */}
        {/* <Route path="/scenario/2" element={<DialogScenario />} /> */}
      </Routes>
    </Router>
  );
};

export default App;

