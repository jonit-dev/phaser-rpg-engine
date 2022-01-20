import { animals, uniqueNamesGenerator } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import { ComponentsScene } from '../../abstractions/CustomScene';
import { Entity } from '../../abstractions/Entity';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import MainScene from '../../scenes/mainScene';
import { PlayerMovement } from './components/PlayerMovement';
import { PlayerUI } from './components/PlayerUI';

export class Player extends Entity {
  public static id = uuidv4();

  public name: string;

  constructor(scene: ComponentsScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, MainSceneData.assets);

    this.name = uniqueNamesGenerator({
      dictionaries: [animals],
      length: 1,
    });

    scene.components.addComponent(this, new PlayerUI());
    scene.components.addComponent(this, new PlayerMovement());

    console.log(`Player id ${Player.id} has been created`);

    MainScene.camera.startFollow(this);
    MainScene.camera.roundPixels = true; //! This MUST be after startFollow method, otherwise it won't work
    MainScene.camera.centerOn(this.x, this.y);
    MainScene.camera.followOffset.set(MainScene.camera.worldView.width / 2, MainScene.camera.worldView.height / 2);
  }
}
