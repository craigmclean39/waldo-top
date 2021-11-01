import { useHistory, useLocation } from 'react-router';
import { Stage, Character, CharacterStatus } from '../types';
import { useEffect, useRef, useState } from 'react';
import { CharacterSelect } from '../components/CharacterSelect';

import {
  getFirestore,
  getDoc,
  doc,
  addDoc,
  setDoc,
  collection,
  serverTimestamp,
  DocumentReference,
  DocumentData,
  FieldValue,
} from 'firebase/firestore';
import { async } from '@firebase/util';

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
  const [characterStatus, setCharacterStatus] = useState<CharacterStatus[]>([]);
  const [userTimestampsDocId, setUserTimestampsDocId] = useState('');
  const history = useHistory();

  useEffect(() => {
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

  useEffect(() => {
    //Make an entry in the database with a server timestamp for leaderboard purposes
    createUserSessionInDbWithStartTime();
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

  const createUserSessionInDbWithStartTime = async () => {
    const docRef = await addDoc(collection(getFirestore(), 'userTimestamps'), {
      startTime: serverTimestamp(),
    });
    console.log('Document written with ID: ', docRef.id);
    setUserTimestampsDocId(docRef.id);
    return docRef.id;
  };

  const addEndTimeToUserSession = async (
    docRef: DocumentReference<DocumentData>,
    endTime: FieldValue
  ) => {
    await setDoc(
      docRef,
      {
        endTime: endTime,
      },
      { merge: true }
    );
  };

  const addTotalTimeToUserSession = async (
    docRef: DocumentReference<DocumentData>,
    totalTime: number
  ) => {
    console.log('Total User Time on Level: ' + totalTime);
    await setDoc(
      docRef,
      {
        totalTime: totalTime,
      },
      { merge: true }
    );
  };

  const updateUserSessionWithEndTimeAndTotalTime = async () => {
    const endTime = serverTimestamp();
    const docRef = doc(getFirestore(), 'userTimestamps', userTimestampsDocId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await addEndTimeToUserSession(docRef, endTime);

      const newSnap = await getDoc(docRef);

      if (newSnap.exists()) {
        await addTotalTimeToUserSession(
          docRef,
          newSnap.data().endTime.seconds - newSnap.data().startTime.seconds
        );
      }
    } else {
      console.log('No such document!');
    }
  };

  const checkCharacter = async (characterId: string) => {
    console.log(stage.current.id);

    const docRef = doc(
      getFirestore(),
      'characterPositions',
      `${stage.current.path}`
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const charPosition = docSnap.get(characterId);

      if (
        checkIfClickIsWithinRadiusOfCoordinates(
          characterSelectX,
          characterSelectY,
          charPosition[0],
          charPosition[1],
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
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }

    setShowCharacterSelect(false);
    checkGameOver();
  };

  const checkGameOver = async () => {
    let gameOver = true;
    for (let i = 0; i < characterStatus.length; i++) {
      if (characterStatus[i].found === false) {
        gameOver = false;
        break;
      }
    }

    if (gameOver) {
      await updateUserSessionWithEndTimeAndTotalTime();
      setInterval(gotoLeaderboard, 1000);
    }
  };

  const gotoLeaderboard = () => {
    history.push({
      pathname: '/leaderboard',
    });
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
