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
  const stage = location.state.stage;

  const reqImg = require(`../images/stages/${stage.path}/gameplay.png`).default;
  const charImages = location.state.characters.map((character) => {
    return (
      <img
        className='pregame__character'
        src={require(`../images/characters/${character.path}.png`).default}
        alt={character.displayName}
        key={character.path}></img>
    );
  });

  return (
    <>
      <Header />
      <div className='pregame-flex'>
        <div className='pregame'>
          <div className='pregame__text-container'>
            <h3 className='pregame__title'>{stage.displayName}</h3>
            <p className='pregame__description'>
              Find the following characters
            </p>
          </div>
          <div className='pregame__characters-container'>{charImages}</div>

          <Link
            className='pregame__start-game-button link'
            to={{
              pathname: '/gameplay',
              state: {
                stage: location.state.stage,
                image: reqImg,
                characters: location.state.characters,
              },
            }}
            replace>
            START GAME
          </Link>
        </div>
      </div>
    </>
  );
};

export { Pregame };
