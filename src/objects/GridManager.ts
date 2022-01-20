import MainScene from '../scenes/mainScene';

export class GridManager {
  constructor(scene, gridEngine, tilemap: Phaser.Tilemaps.Tilemap) {
    const gridEngineConfig = {
      characters: [],
    };

    MainScene.grid = gridEngine;

    return scene.gridEngine.create(tilemap, gridEngineConfig);
  }
}
