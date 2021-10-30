import { CharacterSelectProps } from '../types';

const CharacterSelect: React.FC<CharacterSelectProps> = ({
  x,
  y,
  characters,
  checkCharacter,
}) => {
  return (
    <div className='character-select' style={{ top: y, left: x }}>
      {characters.map((character) => {
        return (
          <img
            src={require(`../images/characters/${character.path}.png`).default}
            onClick={() => {
              checkCharacter(character.id);
            }}
            alt={character.displayName}
            key={character.id}
            className='character-select__character'></img>
        );
      })}
    </div>
  );
};

export { CharacterSelect };
