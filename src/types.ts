export interface Stage {
  id: string;
  path: string;
}

export interface StageSelectProps {
  stages: Stage[];
  selectStage(stageId: string): any;
}

export interface StageSelectCardProps {
  stage: Stage;
  selectStage(stageId: string): any;
}
