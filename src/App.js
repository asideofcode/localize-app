import React from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Scenario from './pages/Scenario';
import SplashScreen from './pages/SplashScreen';
import ScenarioList from './pages/ScenarioList';
import ScenarioSelection from './pages/ScenarioSelection';
import { Container } from './components/Container';
import "./App.css";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Container />,
    children: [
      { index: true, element: <SplashScreen /> },
      { path: 'scenarios', element: <ScenarioSelection /> },
      // { path: 'scenarios', element: <ScenarioList /> },
      { path: 'scenario/:id', element: <Scenario /> },
    ],
  },
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;

