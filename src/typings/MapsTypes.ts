export interface IMap {
  JSONKey: string;
  imageKey: string;
  layers: string[];
  tileWidth: number;
  tileHeight: number;
  imagePath: string;
  jsonPath: string;
  tilesetName: string;
}

export enum MapLayers {
  Ground = 0,
  OverGround = 1,
  Player = 2,
  OverPlayer = 3,
}
