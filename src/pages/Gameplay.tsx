import { useHistory, useLocation } from 'react-router';
import { Stage, Position, Character, CharacterStatus } from '../types';
import { useEffect, useRef, useState } from 'react';
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
  const stage = useRef(location.state.stage);
  const characters = useRef(location.state.characters);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [characterSelectX, setCharacterSelectX] = useState(0);
  const [characterSelectY, setCharacterSelectY] = useState(0);
  const [positions, setPositions] = useState<Position[]>([]);
  const [characterStatus, setCharacterStatus] = useState<CharacterStatus[]>([]);
  const history = useHistory();

  useEffect(() => {
    const charPositions: Position[] = [
      { characterId: 'waldo', coordinates: [762, 272] },
      { characterId: 'whitebeard', coordinates: [1110, 220] },
      { characterId: 'wenda', coordinates: [362, 414] },
    ];
    setPositions(charPositions);

    setCharacterStatus(
      characters.current.map((character) => {
        const charStatus: CharacterStatus = {
          characterId: character.id,
          found: false,
        };

        return charStatus;
      })
    );
  }, []);

  const handleClick = (e: any) => {
    setShowCharacterSelect(!showCharacterSelect);
    // console.log(e);
    const xClick = e.pageX - e.target.offsetLeft;
    const yClick = e.pageY - e.target.offsetTop;
    setCharacterSelectX(xClick);
    setCharacterSelectY(yClick);
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

  const checkCharacter = (characterId: string) => {
    console.log(characterId);
    setShowCharacterSelect(false);

    for (let j = 0; j < positions.length; j++) {
      if (characterId === positions[j].characterId) {
        //Check coordinate in a radius
        if (
          checkIfClickIsWithinRadiusOfCoordinates(
            characterSelectX,
            characterSelectY,
            positions[j].coordinates[0],
            positions[j].coordinates[1],
            25
          )
        ) {
          console.log('You clicked ' + characterId);
          for (let i = 0; i < characterStatus.length; i++) {
            if (characterStatus[i].characterId === characterId) {
              if (!characterStatus[i].found) {
                console.log('You found ' + characterId);
                const newCharacterStatus = [...characterStatus];
                newCharacterStatus[i].found = true;
                setCharacterStatus(newCharacterStatus);
                break;
              }
            }
          }
        }
        break;
      }
    }

    checkGameOver();
  };

  const checkGameOver = () => {
    let gameOver = true;
    for (let i = 0; i < characterStatus.length; i++) {
      if (characterStatus[i].found === false) {
        gameOver = false;
        break;
      }
    }

    if (gameOver) {
      history.push({
        pathname: '/leaderboard',
      });
    }
  };

  return (
    <>
      {showCharacterSelect ? (
        <CharacterSelect
          x={characterSelectX}
          y={characterSelectY}
          checkCharacter={checkCharacter}
          characters={characters.current}
        />
      ) : null}
      <img
        src={image.current}
        alt={stage.current.id}
        onClick={(e) => {
          handleClick(e);
        }}></img>
    </>
  );
};

export { Gameplay };
