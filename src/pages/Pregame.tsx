import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Stage, Character } from '../types';
import { Header } from '../components/Header';

interface PregameLocationState {
  state: {
    stage: Stage;
    characters: Character[];
  };
}

const Pregame = () => {
  const location = useLocation() as PregameLocationState;
  const id = location.state.stage.id;
  const stage = location.state.stage;

  const reqImg = require(`../images/stages/${stage.path}/gameplay.png`).default;
  const charImages = location.state.characters.map((character) => {
    return (
      <img
        src={require(`../images/characters/${character.path}.png`).default}
        alt={character.displayName}
        key={character.path}></img>
    );
  });

  return (
    <>
      <Header />
      <div>Pregame {id}</div>
      <div>{charImages}</div>
      <Link
        to={{
          pathname: '/gameplay',
          state: {
            stage: location.state.stage,
            image: reqImg,
            characters: location.state.characters,
          },
        }}
        replace>
        Game
      </Link>
    </>
  );
};

export { Pregame };
