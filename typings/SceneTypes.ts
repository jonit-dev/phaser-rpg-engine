export interface ISceneData {
  key: string;
  assets: {
    [name: string]: {
      key: string;
      path: string;
    };
  };
}
