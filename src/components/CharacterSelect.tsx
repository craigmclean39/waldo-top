import { CharacterSelectProps } from '../types';

const CharacterSelect: React.FC<CharacterSelectProps> = ({ x, y }) => {
  return (
    <div className='character-select' style={{ top: y, left: x }}>
      Test
    </div>
  );
};

export { CharacterSelect };
