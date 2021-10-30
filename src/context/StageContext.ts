import React from 'react';
import { Character, Stage } from '../types';

export type StageContextType = {
  stages: Stage[];
  characters: Character[];
};

export const StageContext = React.createContext<StageContextType | null>(null);
