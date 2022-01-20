import { ComponentsScene } from '../../abstractions/CustomScene';
import { Entity as Entity } from '../../abstractions/Entity';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import MainScene from '../../scenes/mainScene';
import { AnimationDirection } from '../../typings/AnimationTypes';
import { ICameraCoordinates } from '../../typings/PlayerTypes';
import { OtherPlayerMovement } from './components/OtherPlayer/OtherPlayerMovement';

export class OtherPlayer extends Entity {
  private direction: AnimationDirection = 'down';

  public id: string;
  public name: string;

  constructor(
    scene: ComponentsScene,
    id: string,
    name: string,
    x: number,
    y: number,
    direction: AnimationDirection,
    cameraCoordinates: ICameraCoordinates,
    texture: string
  ) {
    super(scene, x, y, texture, MainSceneData.assets);

    this.scene = scene;
    this.direction = direction;
    this.id = id;
    this.name = name;

    scene.components.addComponent(this, new OtherPlayerMovement(this.direction));

    console.log(`💡 Other player(${this.name}) id ${this.id} has been created and added to position: ${x}, ${y}`);
  }

  destroy(fromScene?: boolean): void {
    MainScene.grid.removeCharacter(this.id);
    MainScene.otherPlayers = MainScene.otherPlayers.filter((p) => p.id !== this.id);

    super.destroy(fromScene);
  }
}
