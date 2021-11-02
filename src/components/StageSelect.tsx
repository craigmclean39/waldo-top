import { StageSelectProps } from '../types';
import { StageSelectCard } from './StageSelectCard';

const StageSelect: React.FC<StageSelectProps> = ({ stages, selectStage }) => {
  const cards = stages.map((stage) => {
    return (
      <StageSelectCard stage={stage} key={stage.id} selectStage={selectStage} />
    );
  });

  return (
    <>
      <div className='full-screen-flex'>
        <div className='inner-container'>
          <h3 className='stage-select__title'>Select your stage</h3>
          <div className='inner-container-flex'>{cards}</div>
        </div>
      </div>
    </>
  );
};

export { StageSelect };
