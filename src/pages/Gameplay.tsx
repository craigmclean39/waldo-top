import { useHistory, useLocation } from 'react-router';
import { Stage, Character, CharacterStatus } from '../types';
import { useEffect, useRef, useState } from 'react';
import { CharacterSelect } from '../components/CharacterSelect';
import { Header } from '../components/Header';

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
  const [characterOverlayX, setCharacterOverlayX] = useState(0);
  const [characterOverlayY, setCharacterOverlayY] = useState(0);
  const [characterStatus, setCharacterStatus] = useState<CharacterStatus[]>([]);
  const [userSessionId, setUserSessionId] = useState('');
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
    setCharacterOverlayX(e.pageX);
    setCharacterOverlayY(e.pageY);
  };

  const checkIfClickIsWithinRadiusOfCoordinates = (
    xClick: number,
    yClick: number,
    x: number,
    y: number,
    radius: number
  ) => {
    if (
      Math.sqrt(Math.pow(xClick - x, 2) + Math.pow(yClick - y, 2)) <= radius
    ) {
      return true;
    }
    return false;
  };

  const createUserSessionInDbWithStartTime = async () => {
    const docRef = await addDoc(collection(getFirestore(), 'userTimestamps'), {
      startTime: serverTimestamp(),
    });
    // ('Document written with ID: ', docRef.id);
    setUserSessionId(docRef.id);
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
    // ('Total User Time on Level: ' + totalTime);
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
    const docRef = doc(getFirestore(), 'userTimestamps', userSessionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await addEndTimeToUserSession(docRef, endTime);

      const newSnap = await getDoc(docRef);

      if (newSnap.exists()) {
        let timeInSeconds =
          (newSnap.data().endTime.toMillis() -
            newSnap.data().startTime.toMillis()) /
          1000;

        timeInSeconds = Number(timeInSeconds.toPrecision(4));

        await addTotalTimeToUserSession(docRef, timeInSeconds);
      }
    } else {
      // console.log('No such document!');
    }
  };

  const checkCharacter = async (characterId: string) => {
    // console.log(stage.current.id);

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
        // console.log('You clicked ' + characterId);
        for (let i = 0; i < characterStatus.length; i++) {
          if (characterStatus[i].characterId === characterId) {
            if (!characterStatus[i].found) {
              // console.log('You found ' + characterId);
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
      // console.log('No such document!');
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
      setTimeout(gotoLeaderboard, 1000);
    }
  };

  const gotoLeaderboard = () => {
    history.replace({
      pathname: '/leaderboard',
      state: {
        stage: stage.current,
        sessionId: userSessionId,
      },
    });
  };

  return (
    <>
      <Header />
      {showCharacterSelect ? (
        <CharacterSelect
          x={characterOverlayX}
          y={characterOverlayY}
          checkCharacter={checkCharacter}
          characters={characters.current}
          characterStatus={characterStatus}
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
