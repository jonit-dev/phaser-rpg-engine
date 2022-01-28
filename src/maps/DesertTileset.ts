import { appEnv } from '../constants/appEnv';
import { Tileset } from './Tileset';

export class DesertMapTileset extends Tileset {
  constructor(scene: Phaser.Scene) {
    super(scene, 'desert_map', 'desert', ['0', '+1', '+2']);
  }

  public static preload(scene: Phaser.Scene) {
    scene.load.image('desert', 'assets/tilesets/desert/desert.png');
    scene.load.tilemapTiledJSON('desert_map', `${appEnv.server.url}/maps/desert.json`);
  }
}
