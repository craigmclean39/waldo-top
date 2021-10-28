import { useContext } from 'react';
import { useHistory } from 'react-router';
import { StageContext, StageContextType } from '../context/StageContext';
import { StageSelect } from '../components/StageSelect';
import { StageSelectProps } from '../types';

const Home = () => {
  const { stages } = useContext(StageContext) as StageContextType;
  const history = useHistory();

  const selectStage = (stageId: string) => {
    console.log('Stage ' + stageId + ' selected');
    history.push({
      pathname: '/pregame',
      state: {
        stageId: stageId,
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
