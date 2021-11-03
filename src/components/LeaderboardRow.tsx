import { LeaderboardRowProps } from '../types';

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ entry }) => {
  return (
    <div
      className={
        entry.isUser
          ? 'leaderboard-entry leaderboard-user'
          : 'leaderboard-entry'
      }
      key={entry.name + entry.score}>
      <div className='leaderboard-pos-name'>
        <div className='leaderboard-position'>{entry.position}</div>
        <div className='leaderboard-name'>{entry.name}</div>
      </div>
      <div className='leaderboard-score'>{entry.score}</div>
    </div>
  );
};

export default LeaderboardRow;
