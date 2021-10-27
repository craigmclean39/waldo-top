import { useContext } from 'react';
import { StageContext, StageContextType } from '../context/StageContext';

const Home = () => {
  const { stages } = useContext(StageContext) as StageContextType;

  console.log(stages);

  return <div>Home</div>;
};

export { Home };
