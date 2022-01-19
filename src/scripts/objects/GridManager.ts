import { PLAYER_START_POS_X, PLAYER_START_POS_Y } from '../constants/playerConstants';
import { Player } from './Players/Player';

export class GridManager {
  constructor(scene, player: Player, tilemap: Phaser.Tilemaps.Tilemap) {
    const gridEngineConfig = {
      characters: [
        {
          id: 'player',
          sprite: player,
          // walkingAnimationMapping: 6,
          startPosition: {
            x: PLAYER_START_POS_X,
            y: PLAYER_START_POS_Y,
          },
        },
      ],
    };
    return scene.gridEngine.create(tilemap, gridEngineConfig);
  }
}
