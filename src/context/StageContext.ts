import React from 'react';
import { Stage } from '../types';

export type StageContextType = {
  stages: Stage[];
};

export const StageContext = React.createContext<StageContextType | null>(null);
