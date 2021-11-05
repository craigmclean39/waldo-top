import { useHistory, useLocation } from 'react-router';
import {
  Stage,
  Character,
  CharacterStatus,
  HeaderProps,
  ReticlePosition,
} from '../types';
import { useEffect, useRef, useState } from 'react';
import { CharacterSelect } from '../components/CharacterSelect';
import { Header } from '../components/Header';
import ReticleImage from '../images/focus.png';

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
  const [reticles, setReticles] = useState<ReticlePosition[]>([]);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);

  const [clickAdjustedToImageX, setClickAdjustedToImageX] = useState(0);
  const [clickAdjustedToImageY, setClickAdjustedToImageY] = useState(0);
  const [clickPageX, setClickPageX] = useState(0);
  const [clickPageY, setClickPageY] = useState(0);

  const [characterStatus, setCharacterStatus] = useState<CharacterStatus[]>([]);
  const [userSessionId, setUserSessionId] = useState('');

  const [timerStopped, setTimerStopped] = useState(false);

  const history = useHistory();

  let imageDomRef: HTMLImageElement | null = null;
  const [imageOffsetLeft, setImageOffsetLeft] = useState(0);
  const [imageOffsetTop, setImageOffsetTop] = useState(0);

  const [foundOverlayVisible, setFoundOverlayVisible] = useState(false);
  const [foundCharacterDisplayName, setFoundCharacterDisplayName] =
    useState('');

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

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (imageDomRef != null) {
        setImageOffsetTop(imageDomRef.offsetTop);
        setImageOffsetLeft(imageDomRef.offsetLeft);
      }
    });
  }, [imageDomRef]);

  const handleClick = (e: any) => {
    setShowCharacterSelect(!showCharacterSelect);
    setClickAdjustedToImageX(e.pageX - imageOffsetLeft);
    setClickAdjustedToImageY(e.pageY - imageOffsetTop);

    // console.log(e);
    // console.log(window);

    setClickPageX(e.pageX);
    setClickPageY(e.pageY);

    //If the select character overlay is going to fall off the screen, move it over
    if (window.innerWidth - e.clientX < 160) {
      setClickPageX(e.pageX - (160 - (window.innerWidth - e.clientX)));
    }
  };

  const imageRefCallback = (e: HTMLImageElement) => {
    if (e != null) {
      setImageOffsetLeft(e.offsetLeft);
      setImageOffsetTop(e.offsetTop);
      imageDomRef = e;
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
          clickAdjustedToImageX,
          clickAdjustedToImageY,
          charPosition[0],
          charPosition[1],
          25
        )
      ) {
        for (let i = 0; i < characterStatus.length; i++) {
          if (characterStatus[i].characterId === characterId) {
            if (!characterStatus[i].found) {
              const newCharacterStatus = [...characterStatus];
              newCharacterStatus[i].found = true;
              setCharacterStatus(newCharacterStatus);

              const newReticles = [...reticles];
              const newReticle = {
                x: clickAdjustedToImageX,
                y: clickAdjustedToImageY,
              };
              newReticles.push(newReticle);
              setReticles(newReticles);

              setFoundOverlayVisible(true);
              for (let i = 0; i < characters.current.length; i++) {
                if (characters.current[i].id === characterId) {
                  setFoundCharacterDisplayName(
                    characters.current[i].displayName
                  );
                  break;
                }
              }

              setTimeout(() => {
                setFoundOverlayVisible(false);
              }, 1500);

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
      setTimerStopped(true);
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

  const headerProps: HeaderProps = {
    hasTimer: true,
    stopTimer: timerStopped,
  };

  const reticleImgElements = reticles.map((retPos) => {
    return (
      <img
        src={ReticleImage}
        alt=''
        className='reticle'
        style={{
          top: retPos.y - 25 + imageOffsetTop,
          left: retPos.x - 25 + imageOffsetLeft,
        }}></img>
    );
  });

  return (
    <>
      <Header {...headerProps} />
      {showCharacterSelect ? (
        <CharacterSelect
          x={clickPageX}
          y={clickPageY}
          checkCharacter={checkCharacter}
          characters={characters.current}
          characterStatus={characterStatus}
        />
      ) : null}
      <div className='gameplay__image-flex'>
        <img
          ref={imageRefCallback}
          src={image.current}
          alt={stage.current.id}
          onClick={(e) => {
            handleClick(e);
          }}></img>
      </div>
      {reticleImgElements}
      {foundOverlayVisible ? (
        <div
          className='gameplay__found-container'
          onClick={(e) => {
            setFoundOverlayVisible(false);
            handleClick(e);
          }}>
          <div className='gameplay__found slide-in-fwd-center'>{`You found ${foundCharacterDisplayName}`}</div>
        </div>
      ) : null}
    </>
  );
};

export { Gameplay };
