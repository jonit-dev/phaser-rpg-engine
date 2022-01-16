export class Tileset {
  constructor(scene: Phaser.Scene, tilemapKey: string, tilesetImageKey: string, layerNames: string[]) {
    const tilemap = scene.add.tilemap(tilemapKey);

    const tileset = tilemap.addTilesetImage(tilesetImageKey, tilesetImageKey);

    for (const layer of layerNames) {
      tilemap.createLayer(layer, tileset, 0, 0);
    }
  }
}
