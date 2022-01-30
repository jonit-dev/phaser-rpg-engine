import { IAnimationData } from './AnimationTypes';

export interface IAssetData {
  [asset: string]: IAssetAttributes;
}

export interface IAssetAttributes {
  textureKey: string;
  path: string;
  animations: IAnimationData;
}
