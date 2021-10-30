import { StageSelectCardProps } from '../types';

const StageSelectCard: React.FC<StageSelectCardProps> = ({
  stage,
  selectStage,
}) => {
  const reqImg =
    require(`../images/stages/${stage.path}/thumbnail.png`).default;

  return (
    <img src={reqImg} alt={stage.id} onClick={() => selectStage(stage)}></img>
  );
};

export { StageSelectCard };
