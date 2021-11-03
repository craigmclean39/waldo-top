import { LeaderboardFormProps } from '../types';
const LeaderboardForm: React.FC<LeaderboardFormProps> = ({
  submitName,
  handleChange,
  name,
}) => {
  return (
    <div className='leaderboard-form-container'>
      <div className='leaderboard-form__title'>Enter your name</div>
      <form className='leaderboard-form' onSubmit={submitName}>
        <input
          className='leaderboard-form__text-input'
          type='text'
          onChange={handleChange}
          value={name}
          maxLength={15}></input>
        <button className='pregame__start-game-button' type='submit'>
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default LeaderboardForm;
