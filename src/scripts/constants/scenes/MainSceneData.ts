import { ISceneData } from '../../../../typings/SceneTypes';

export const MainSceneData: ISceneData = {
  key: 'MainScene',
  assets: {
    player: {
      textureKey: 'player',
      path: 'assets/spritesheets/player.png',
      animations: {
        down: {
          walking: [0, 2],
          standing: 1,
        },
        up: {
          walking: [9, 11],
          standing: 10,
        },
        left: {
          walking: [3, 5],
          standing: 4,
        },
        right: {
          walking: [6, 8],
          standing: 7,
        },
      },
    },
  },
};
