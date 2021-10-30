export interface Stage {
  id: string;
  path: string;
  characterIds: string[];
}

export interface Character {
  id: string;
  displayName: string;
  path: string;
}

export interface StageSelectProps {
  stages: Stage[];
  selectStage(stage: Stage): any;
}

export interface StageSelectCardProps {
  stage: Stage;
  selectStage(stage: Stage): any;
}
