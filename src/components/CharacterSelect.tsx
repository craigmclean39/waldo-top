import { CharacterSelectProps } from '../types';

const CharacterSelect: React.FC<CharacterSelectProps> = ({
  x,
  y,
  characters,
  checkCharacter,
  characterStatus,
}) => {
  return (
    <div className='character-select' style={{ top: y, left: x }}>
      {characters.map((character) => {
        let additionalClasses = '';
        for (let i = 0; i < characterStatus.length; i++) {
          if (character.id === characterStatus[i].characterId) {
            if (!characterStatus[i].found) {
              additionalClasses = 'character--selectable';
            } else {
              additionalClasses = 'character--inactive';
            }
          }
        }

        return (
          <img
            src={
              require(`../images/characters/${character.path}-small.png`)
                .default
            }
            onClick={() => {
              checkCharacter(character.id);
            }}
            alt={character.displayName}
            key={character.id}
            className={`character-select__character ${additionalClasses}`}></img>
        );
      })}
    </div>
  );
};

export { CharacterSelect };
