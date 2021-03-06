import { useRef } from 'react';
import { Home } from './pages/Home';
import { Pregame } from './pages/Pregame';
import { Gameplay } from './pages/Gameplay';
import { Leaderboard } from './pages/Leaderboard';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { Stage, Character } from './types';
import { StageContext, StageContextType } from './context/StageContext';
import { useFirebase } from './hooks/useFirebase';

function App() {
  const stages = useRef<Stage[]>([
    {
      id: 'waldo-stage-1',
      path: 'stage-1',
      displayName: 'The Deep Sea Divers',
      characterIds: ['waldo', 'wenda', 'whitebeard'],
    },
    {
      id: 'waldo-stage-2',
      path: 'stage-2',
      displayName: 'The Great Ball Game Players',
      characterIds: ['waldo', 'odlaw', 'whitebeard'],
    },
    {
      id: 'waldo-stage-3',
      path: 'stage-3',
      displayName: 'The Great Escape',
      characterIds: ['waldo', 'wenda', 'odlaw', 'whitebeard'],
    },
    {
      id: 'waldo-stage-4',
      path: 'stage-4',
      displayName: 'Horseplay in Troy',
      characterIds: ['waldo', 'wenda', 'odlaw', 'whitebeard'],
    },
  ]);

  const characters = useRef<Character[]>([
    { id: 'waldo', path: 'waldo', displayName: 'Waldo' },
    { id: 'odlaw', path: 'odlaw', displayName: 'Odlaw' },
    { id: 'wenda', path: 'wenda', displayName: 'Wenda' },
    { id: 'whitebeard', path: 'whitebeard', displayName: 'Wizard Whitebeard' },
  ]);

  let stageContextValue: StageContextType = {
    stages: stages.current,
    characters: characters.current,
  };

  useFirebase();

  return (
    <StageContext.Provider value={stageContextValue}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path='/' component={Home}></Route>
          <Route exact path='/pregame' component={Pregame}></Route>
          <Route path='/leaderboard' component={Leaderboard}></Route>
          <Route path='/gameplay' component={Gameplay}></Route>
        </Switch>
      </BrowserRouter>
    </StageContext.Provider>
  );
}

export default App;
