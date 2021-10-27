import React from 'react';
import { useRef } from 'react';
import { Home } from './pages/Home';
import { Pregame } from './pages/Pregame';
import { Gameplay } from './pages/Gameplay';
import { Leaderboard } from './pages/Leaderboard';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { Stage } from './types';
import { StageContext, StageContextType } from './context/StageContext';

function App() {
  const stages = useRef<Stage[]>([
    {
      id: 'waldo-stage-1',
      path: 'stage-1',
    },
    {
      id: 'waldo-stage-2',
      path: 'stage-2',
    },
    {
      id: 'waldo-stage-2',
      path: 'stage-2',
    },
    {
      id: 'waldo-stage-2',
      path: 'stage-2',
    },
  ]);

  let stageContextValue: StageContextType = {
    stages: stages.current,
  };

  return (
    <StageContext.Provider value={stageContextValue}>
      <HashRouter>
        <Switch>
          <Route exact path='/' component={Home}></Route>
          <Route exact path='/pregame/:id' component={Pregame}></Route>
          <Route path='/leaderboard/:id' component={Leaderboard}></Route>
          <Route path='/gameplay' component={Gameplay}></Route>
        </Switch>
      </HashRouter>
    </StageContext.Provider>
  );
}

export default App;
