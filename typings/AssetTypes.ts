import { IAnimationData } from './AnimationTypes';

export interface IAssetData {
  [asset: string]: {
    key: string;
    path: string;
    animations: IAnimationData;
  };
}
