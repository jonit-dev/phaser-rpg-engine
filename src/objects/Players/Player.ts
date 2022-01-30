import { animals, uniqueNamesGenerator } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import { ComponentsScene } from '../../abstractions/CustomScene';
import { Entity } from '../../abstractions/Entity';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { PlayerCamera } from './components/Player/PlayerCamera';
import { PlayerMovement } from './components/Player/PlayerMovement';
import { PlayerUI } from './components/Player/PlayerUI';
export class Player extends Entity {
  public static id = uuidv4();
  public tilemap: Phaser.Tilemaps.Tilemap;

  public key: string;

  constructor(scene: ComponentsScene, x: number, y: number, texture: string, tilemap: Phaser.Tilemaps.Tilemap) {
    super(scene, x, y, texture, MainSceneData.assets);

    this.tilemap = tilemap;

    this.key = uniqueNamesGenerator({
      dictionaries: [animals],
      length: 1,
    });

    scene.components.addComponent(this, new PlayerCamera());
    scene.components.addComponent(this, new PlayerMovement());
    scene.components.addComponent(this, new PlayerUI());
  }
}
