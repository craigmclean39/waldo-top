import { LeaderboardFormProps, Stage } from '../types';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
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
  deleteDoc,
} from 'firebase/firestore';

import { Header } from '../components/Header';
import { LeaderboardEntry } from '../types';
import LeaderboardRow from '../components/LeaderboardRow';
import LeaderboardForm from '../components/LeaderboardForm';

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
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [score, setScore] = useState(0);
  const [userIsInTop10, setUserIsInTop10] = useState(false);

  const submitName = async (e: SyntheticEvent) => {
    e.preventDefault();
    await addUserScoreToLeaderboard();
    await deleteSession();
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
      if (doc.data().sessionId === sessionId.current) {
        setUserIsInTop10(true);
      }
      const entry: LeaderboardEntry = {
        name: doc.data().name,
        score: doc.data().score,
        isUser: doc.data().sessionId === sessionId.current ? true : false,
      };
      loadedLeaderboard.push(entry);
    });

    setLeaderboard(loadedLeaderboard);
  };

  const addUserScoreToLeaderboard = async () => {
    const userScore = await getUsersScore();

    setScore(userScore);
    await addDoc(
      collection(getFirestore(), `${stage.current.path}-leaderboard`),
      {
        name: name,
        score: userScore,
        sessionId: sessionId.current,
      }
    );

    setNameEntered(true);
  };

  const deleteSession = async () => {
    await deleteDoc(doc(getFirestore(), 'userTimestamps', sessionId.current));
  };

  const getUsersScore = async () => {
    const docRef = doc(getFirestore(), 'userTimestamps', sessionId.current);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().totalTime;
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const formProps: LeaderboardFormProps = {
    submitName: submitName,
    handleChange: handleChange,
    name: name,
  };

  return !nameEntered ? (
    <>
      <LeaderboardForm {...formProps} />
    </>
  ) : (
    <>
      <Header />
      <div className='leaderboard'>
        <div className='leaderboard-inner'>
          <div className='leaderboard-title'>{stage.current.displayName}</div>
          {leaderboard.map((entry, index) => {
            entry.position = index + 1;
            return <LeaderboardRow entry={entry} />;
          })}
          {userIsInTop10 ? null : (
            <LeaderboardRow
              entry={{ name: name, score: score, isUser: true }}
            />
          )}
          <Link
            className='pregame__start-game-button link'
            to={{
              pathname: '/',
            }}
            replace>
            HOME
          </Link>
        </div>
      </div>
    </>
  );
};

export { Leaderboard };
