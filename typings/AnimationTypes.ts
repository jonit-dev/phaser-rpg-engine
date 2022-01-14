export type AnimationDirection = 'down' | 'up' | 'left' | 'right';

export interface IAnimationData {
  [direction: string]: {
    walking: {
      key: string;
      frames: {
        start: number;
        end: number;
      };
    };
    standing: {
      key: string;
      frame: number;
    };
  };
}
