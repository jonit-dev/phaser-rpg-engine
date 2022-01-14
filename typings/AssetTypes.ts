import { IAnimationData } from './AnimationTypes';

export interface IAssetData {
  [asset: string]: {
    textureKey: string;
    path: string;
    animations: IAnimationData;
  };
}
