import { GRID_HEIGHT, GRID_WIDTH } from '../../constants/worldConstants';

export class Tileset {
  public tilemap: Phaser.Tilemaps.Tilemap;

  constructor(scene: Phaser.Scene, tilemapKey: string, tilesetImageKey: string, layerNames: string[]) {
    this.tilemap = scene.add.tilemap(tilemapKey);

    const tileset = this.tilemap.addTilesetImage(tilesetImageKey, tilesetImageKey, GRID_WIDTH, GRID_HEIGHT);

    for (const layerName of layerNames) {
      const layer = this.tilemap.createLayer(layerName, tileset, 0, 0);
    }
  }
}
