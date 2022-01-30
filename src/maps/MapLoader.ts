import { TILE_HEIGHT, TILE_WIDTH } from '../constants/worldConstants';
import { maps } from './maps';

export class MapLoader {
  public tilemap: Phaser.Tilemaps.Tilemap;
  public scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, MapJSONKey: string) {
    this.scene = scene;

    const map = maps.find((m) => m.JSONKey === MapJSONKey);

    if (!map) {
      throw new Error('Map not found. Please check your map key');
    }

    this.tilemap = this.scene.make.tilemap({ key: map.JSONKey, tileWidth: TILE_WIDTH, tileHeight: TILE_HEIGHT });

    const tileset = this.tilemap.addTilesetImage(map.tilesetName, map.imageKey, TILE_WIDTH, TILE_HEIGHT);

    // create layers
    for (let i = 0; i < map.layers.length; i++) {
      const layer = this.tilemap.createLayer(map.layers[i], tileset, 0, 0);
      layer.setDepth(i);
    }
  }
}
