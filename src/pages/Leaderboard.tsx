import { Stage } from '../types';
import { useHistory, useLocation } from 'react-router';
import { useEffect, useRef, useState, SyntheticEvent } from 'react';
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

interface LeaderboardLocationState {
  state: {
    stage: Stage;
    sessionId: string;
  };
}

const Leaderboard = () => {
  const location = useLocation() as LeaderboardLocationState;
  const sessionId = useRef(location.state.sessionId);
  const stage = useRef(location.state.stage);
  const [nameEntered, setNameEntered] = useState(false);
  const [name, setName] = useState('');

  const submitName = (e: SyntheticEvent) => {
    e.preventDefault();

    console.log('Name Submitted');
    addUserScoreToLeaderboard();
  };

  /*   const createUserSessionInDbWithStartTime = async () => {
    const docRef = await addDoc(collection(getFirestore(), 'userTimestamps'), {
      startTime: serverTimestamp(),
    });
    console.log('Document written with ID: ', docRef.id);
    setUserSessionId(docRef.id);
    return docRef.id;
  }; */

  const addUserScoreToLeaderboard = async () => {
    const userScore = await getUsersScore();

    await addDoc(
      collection(getFirestore(), `${stage.current.path}-leaderboard`),
      {
        name: name,
        score: userScore,
      }
    );

    setNameEntered(true);
  };

  const getUsersScore = async () => {
    const docRef = doc(getFirestore(), 'userTimestamps', sessionId.current);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().totalTime;
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    console.log(e);
    setName(e.currentTarget.value);
  };

  return !nameEntered ? (
    <>
      <form onSubmit={submitName}>
        <input type='text' onChange={handleChange} value={name}></input>
        <button type='submit'>Submit</button>
      </form>
    </>
  ) : (
    <>
      <div>Leaderboard</div>
    </>
  );
};

export { Leaderboard };
