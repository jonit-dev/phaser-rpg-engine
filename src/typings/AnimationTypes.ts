export type AnimationDirection = 'down' | 'up' | 'left' | 'right';

export interface IAnimationData {
  [direction: string]: {
    walking: number[];
    standing: number | number[];
  };
}
