import { useContext } from 'react';
import { useHistory } from 'react-router';
import { StageContext, StageContextType } from '../context/StageContext';
import { StageSelect } from '../components/StageSelect';
import { StageSelectProps, Stage, Character } from '../types';

const Home = () => {
  const { stages, characters } = useContext(StageContext) as StageContextType;
  const history = useHistory();

  const selectStage = (stage: Stage) => {
    const stageCharacters: Character[] = [];
    for (let i = 0; i < stage.characterIds.length; i++) {
      for (let j = 0; j < characters.length; j++) {
        if (stage.characterIds[i] === characters[j].id) {
          stageCharacters.push(characters[j]);
        }
      }
    }

    history.push({
      pathname: '/pregame',
      state: {
        stage: stage,
        characters: stageCharacters,
      },
    });
  };

  const stageSelectProps: StageSelectProps = {
    stages: stages,
    selectStage: selectStage,
  };

  return <StageSelect {...stageSelectProps} />;
};

export { Home };
