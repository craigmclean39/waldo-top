import { useLocation } from 'react-router';
import { Stage } from '../types';

interface GameplayLocationState {
  state: {
    stage: Stage;
    image: string;
  };
}

const Gameplay = () => {
  const location = useLocation() as GameplayLocationState;
  const image = location.state.image;
  const id = location.state.stage.id;

  return (
    <img
      src={image}
      alt={id}
      onClick={(e) => {
        console.dir(e);
      }}></img>
  );
};

export { Gameplay };
