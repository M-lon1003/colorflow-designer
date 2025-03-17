
export type ColorCode = 'r' | 'g' | 'b' | 'c' | 'm' | 'y' | 'k' | 'w';

export interface ColorInfo {
  code: ColorCode;
  name: string;
  hexValue: string;
}

export interface LevelBlock {
  id: string;
  x: number;
  y: number;
  color: ColorCode;
}

export interface PlayerState {
  x: number;
  y: number;
  currentColor: ColorCode;
}

export interface LevelData {
  id: string;
  name: string;
  width: number;
  height: number;
  startPosition: { x: number; y: number };
  startColor: ColorCode;
  targetColor: ColorCode;
  blocks: LevelBlock[];
  allowedColors: ColorCode[];
  maxSteps: number;
  description?: string;
  challengeType: ChallengeType;
}

export type ChallengeType = 
  | 'colorPath' 
  | 'minimalSteps' 
  | 'colorRestriction' 
  | 'targetMatching'
  | 'colorMixing';

export interface ChallengeSetting {
  type: ChallengeType;
  name: string;
  description: string;
}

export interface SavedLevel {
  id: string;
  name: string;
  lastEdited: string;
  data: LevelData;
}
