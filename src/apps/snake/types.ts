export enum GameState {
  MENU,
  PLAYING,
  PAUSED,
  GAME_OVER,
  STORE,
  SETTINGS,
  STATS,
  ACHIEVEMENTS
}

export enum GameMode {
  CLASSIC = 'CLASSIC',
  NO_WALLS = 'NO_WALLS',
  TIME_ATTACK = 'TIME_ATTACK',
  COIN_FEVER = 'COIN_FEVER',
  FORBIDDEN = 'FORBIDDEN',
  ALL_IN = 'ALL_IN'
}

export interface Position {
  x: number;
  y: number;
}

export type SkinPattern = 'solid' | 'striped' | 'scaled' | 'gradient' | 'none';

export type SkinMaterial =
  | 'organic'
  | 'energy'
  | 'fire'
  | 'metal'
  | 'void'
  | 'cyber'
  | 'sludge'
  | 'ice'
  | 'shadow'
  | 'magma'
  | 'plasma'
  | 'blood'
  | 'crystal'
  | 'light'
  | 'rainbow';

export interface SkinVisualProfile {
  material: SkinMaterial;
  highlightColor: string;
  detailColor: string;
  secondaryDetailColor: string;
  outlineColor: string;
  bellyColor: string;
  eyeColor: string;
  pupilColor: string;
}

export interface Skin {
  id: string;
  name: string;
  price: number;
  headColor: string;
  bodyColors: string[];
  glowColor: string;
  particleType: 'sparkle' | 'fire' | 'digital' | 'smoke' | 'bubble' | 'ice' | 'ghost' | 'rainbow' | 'leaf' | 'gold' | 'plasma' | 'none';
  trail: boolean;
  pattern: SkinPattern;
  visual: SkinVisualProfile;
}

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  particles: boolean;
  screenShake: boolean;
  glow: boolean;
  headTracksFood: boolean;
  gridSize: number;
  difficulty: 'very_easy' | 'easy' | 'medium' | 'hard';
}

export interface Stats {
  gamesPlayed: number;
  totalScore: number;
  foodEaten: number;
  maxLength: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SaveData {
  coins: number;
  highScores: Record<GameMode, number>;
  unlockedSkins: string[];
  selectedSkin: string;
  settings: GameSettings;
  stats: Stats;
  unlockedAchievements: string[];
}
