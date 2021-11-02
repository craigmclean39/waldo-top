import { StageSelectCardProps } from '../types';

const StageSelectCard: React.FC<StageSelectCardProps> = ({
  stage,
  selectStage,
}) => {
  const reqImg =
    require(`../images/stages/${stage.path}/thumbnail.png`).default;

  return (
    <div className='stage-card'>
      <h4 className='stage-card__title'>{stage.displayName}</h4>
      <img
        className='stage-card__image'
        src={reqImg}
        alt={stage.id}
        onClick={() => selectStage(stage)}></img>
    </div>
  );
};

export { StageSelectCard };
