import { useLocation } from 'react-router';
import { Stage, Position, Character } from '../types';
import { useRef, useState } from 'react';
import { CharacterSelect } from '../components/CharacterSelect';

interface GameplayLocationState {
  state: {
    stage: Stage;
    image: string;
    characters: Character[];
  };
}

const Gameplay = () => {
  const location = useLocation() as GameplayLocationState;
  const image = useRef(location.state.image);
  const id = useRef(location.state.stage.id);
  const stage = useRef(location.state.stage);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [characterSelectX, setCharacterSelectX] = useState(0);
  const [characterSelectY, setCharacterSelectY] = useState(0);

  const positions: Position[] = [
    { characterId: 'waldo', coordinates: [762, 272] },
    { characterId: 'whitebeard', coordinates: [1110, 220] },
    { characterId: 'wenda', coordinates: [362, 414] },
  ];

  const checkClick = (e: any) => {
    setShowCharacterSelect(!showCharacterSelect);
    // console.log(e);
    const xClick = e.pageX - e.target.offsetLeft;
    const yClick = e.pageY - e.target.offsetTop;
    setCharacterSelectX(xClick);
    setCharacterSelectY(yClick);

    for (let i = 0; i < stage.current.characterIds.length; i++) {
      for (let j = 0; j < positions.length; j++) {
        if (stage.current.characterIds[i] === positions[j].characterId) {
          //Check coordinate in a radius
          if (
            checkIfClickIsWithinRadiusOfCoordinates(
              xClick,
              yClick,
              positions[j].coordinates[0],
              positions[j].coordinates[1],
              25
            )
          ) {
            console.log('You found ' + positions[j].characterId);
          }
        }
      }
    }
  };

  const checkIfClickIsWithinRadiusOfCoordinates = (
    xClick: number,
    yClick: number,
    x: number,
    y: number,
    radius: number
  ) => {
    if (
      xClick >= x - radius &&
      xClick <= x + radius &&
      yClick >= y - radius &&
      yClick <= y + radius
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      {showCharacterSelect ? (
        <CharacterSelect x={characterSelectX} y={characterSelectY} />
      ) : null}
      <img
        src={image.current}
        alt={id.current}
        onClick={(e) => {
          checkClick(e);
        }}></img>
    </>
  );
};

export { Gameplay };
