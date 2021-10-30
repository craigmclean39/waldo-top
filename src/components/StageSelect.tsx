import { StageSelectProps } from '../types';
import { StageSelectCard } from './StageSelectCard';

const StageSelect: React.FC<StageSelectProps> = ({ stages, selectStage }) => {
  const cards = stages.map((stage) => {
    return (
      <StageSelectCard stage={stage} key={stage.id} selectStage={selectStage} />
    );
  });

  return <>{cards}</>;
};

export { StageSelect };
