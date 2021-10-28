import { useLocation } from 'react-router';

interface PregameLocationState {
  state: {
    stageId: string;
  };
}

const Pregame = () => {
  const location = useLocation() as PregameLocationState;
  const id = location.state.stageId;
  return <div>Pregame {id}</div>;
};

export { Pregame };
