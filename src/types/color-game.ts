
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
  color: ColorCode | string; // Now supports hex codes
  blendRatio?: number; // Blend ratio for this block
}

export interface PlayerState {
  x: number;
  y: number;
  currentColor: ColorCode | string; // Now supports hex codes
}

export interface LevelData {
  id: string;
  name: string;
  width: number;
  height: number;
  startPosition: { x: number; y: number };
  startColor: ColorCode | string; // Now supports hex codes
  targetColor: ColorCode | string; // Now supports hex codes
  blocks: LevelBlock[];
  allowedColors: (ColorCode | string)[]; // Now supports hex codes
  maxSteps: number;
  description?: string;
  challengeType: ChallengeType;
  defaultBlendRatio?: number; // Default blend ratio for the level
  useSimpleMixing?: boolean; // Whether to use simple color mixing (R+G=Y, etc.) or advanced hex blending
  colorTolerance?: number; // Tolerance range for matching target color (0-255)
  calculatedMinSteps?: number; // Calculated minimum steps to reach target
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

export interface ColorMixResult {
  from: ColorCode | string;
  to: ColorCode | string;
  result: ColorCode | string;
  ratio?: number;
}

export interface ClassicColorBlend {
  color1: ColorCode | string;
  color2: ColorCode | string;
  result: ColorCode | string;
  name: string;
}
