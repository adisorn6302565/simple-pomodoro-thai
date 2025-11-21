export enum TimerMode {
  WORK = 'WORK',
  BREAK = 'BREAK'
}

export type SoundType = 
  | 'classic' 
  | 'bell' 
  | 'digital' 
  | 'bird' 
  | 'piano' 
  | 'arcade' 
  | 'future' 
  | 'breeze' 
  | 'success' 
  | 'alert';

export interface TimerSettings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  soundEnabled: boolean;
  volume: number;
  soundType: SoundType;
}