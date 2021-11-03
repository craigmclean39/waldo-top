import { SyntheticEvent } from 'react-router/node_modules/@types/react';

export interface Stage {
  id: string;
  path: string;
  displayName: string;
  characterIds: string[];
}

export interface Character {
  id: string;
  displayName: string;
  path: string;
}

export interface Position {
  characterId: string;
  coordinates: number[];
}

export interface CharacterStatus {
  characterId: string;
  found: boolean;
}

//PROPS
export interface StageSelectProps {
  stages: Stage[];
  selectStage(stage: Stage): any;
}

export interface StageSelectCardProps {
  stage: Stage;
  selectStage(stage: Stage): any;
}

export interface CharacterSelectProps {
  x: number;
  y: number;
  checkCharacter(characterId: string): any;
  characters: Character[];
  characterStatus: CharacterStatus[];
}

export interface HeaderProps {
  hasTimer?: boolean;
  timerValue?: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  isUser: boolean;
  position?: number;
}

export interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

export interface LeaderboardFormProps {
  submitName(e: SyntheticEvent): any;
  handleChange(e: React.FormEvent<HTMLInputElement>): any;
  name: string;
}
