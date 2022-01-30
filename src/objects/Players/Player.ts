import { animals, uniqueNamesGenerator } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import { ComponentsScene } from '../../abstractions/ComponentsScene';
import { Entity } from '../../abstractions/Entity';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { GRID_HEIGHT, GRID_WIDTH } from '../../constants/worldConstants';
import { PlayerCamera } from './components/Player/PlayerCamera';
import { PlayerDebug } from './components/Player/PlayerDebug';
import { PlayerMovement } from './components/Player/PlayerMovement';
import { PlayerUI } from './components/Player/PlayerUI';
export class Player extends Entity {
  public static id = uuidv4();
  public tilemap: Phaser.Tilemaps.Tilemap;

  public name: string;

  constructor(scene: ComponentsScene, x: number, y: number, texture: string, tilemap: Phaser.Tilemaps.Tilemap) {
    super(scene, x, y, texture, MainSceneData.assets);

    this.tilemap = tilemap;

    this.name = uniqueNamesGenerator({
      dictionaries: [animals],
      length: 1,
    });

    scene.components.addComponent(this, new PlayerCamera());
    scene.components.addComponent(this, new PlayerMovement());
    scene.components.addComponent(this, new PlayerUI());
    this.setDisplayOrigin(GRID_WIDTH, GRID_HEIGHT);

    scene.components.addComponent(this, new PlayerDebug());
  }
}
