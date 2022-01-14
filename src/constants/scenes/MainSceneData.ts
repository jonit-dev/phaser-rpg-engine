import { ISceneData } from '../../../typings/SceneTypes';

export const MainSceneData: ISceneData = {
  key: 'MainScene',
  assets: {
    player: {
      key: 'player',
      path: 'assets/mainScene/images/spritesheets/player.png',
      animations: {
        down: {
          walking: {
            key: 'player_down_walking',
            frames: {
              start: 0,
              end: 2,
            },
          },
          standing: {
            key: 'player_down_standing',
            frame: 1,
          },
        },
        up: {
          walking: {
            key: 'player_up_walking',
            frames: {
              start: 9,
              end: 11,
            },
          },
          standing: {
            key: 'player_up_standing',
            frame: 10,
          },
        },
        left: {
          walking: {
            key: 'player_left_walking',
            frames: {
              start: 3,
              end: 5,
            },
          },
          standing: {
            key: 'player_left_standing',
            frame: 4,
          },
        },
        right: {
          walking: {
            key: 'player_right_walking',
            frames: {
              start: 6,
              end: 8,
            },
          },
          standing: {
            key: 'player_right_standing',
            frame: 7,
          },
        },
      },
    },
  },
};
