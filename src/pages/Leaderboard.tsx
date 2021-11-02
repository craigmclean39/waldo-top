import { Stage } from '../types';
import { useLocation } from 'react-router';
import { useRef, useState, SyntheticEvent } from 'react';
import {
  getFirestore,
  getDoc,
  doc,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

import { Header } from '../components/Header';

interface LeaderboardLocationState {
  state: {
    stage: Stage;
    sessionId: string;
  };
}

interface LeaderboardEntry {
  name: string;
  score: number;
}

const Leaderboard = () => {
  const location = useLocation() as LeaderboardLocationState;
  const sessionId = useRef(location.state.sessionId);
  const stage = useRef(location.state.stage);
  const [nameEntered, setNameEntered] = useState(false);
  const [name, setName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const submitName = async (e: SyntheticEvent) => {
    e.preventDefault();

    // console.log('Name Submitted');
    await addUserScoreToLeaderboard();
    await loadLeaderboard();
  };

  const loadLeaderboard = async () => {
    const leaderBoardRef = collection(
      getFirestore(),
      `${stage.current.path}-leaderboard`
    );
    const q = query(leaderBoardRef, orderBy('score'), limit(10));

    const loadedLeaderboard: LeaderboardEntry[] = [];

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, ' => ', doc.data());
      const entry: LeaderboardEntry = {
        name: doc.data().name,
        score: doc.data().score,
      };
      loadedLeaderboard.push(entry);
    });

    setLeaderboard(loadedLeaderboard);
  };

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
    // console.log(e);
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
      <Header />
      <div>Leaderboard</div>
      {leaderboard.map((entry) => {
        return (
          <div
            key={
              entry.name + entry.score
            }>{`${entry.name} ${entry.score}`}</div>
        );
      })}
    </>
  );
};

export { Leaderboard };
