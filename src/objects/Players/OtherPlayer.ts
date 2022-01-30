import { ComponentsScene } from '../../abstractions/ComponentsScene';
import { Entity as Entity } from '../../abstractions/Entity';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { GRID_HEIGHT, GRID_WIDTH } from '../../constants/worldConstants';
import MainScene from '../../scenes/mainScene';
import { AnimationDirection } from '../../typings/AnimationTypes';
import { ICameraCoordinates } from '../../typings/PlayerTypes';
import { OtherPlayerMovement } from './components/OtherPlayer/OtherPlayerMovement';
import { PlayerDebug } from './components/Player/PlayerDebug';
import { PlayerUI } from './components/Player/PlayerUI';

export class OtherPlayer extends Entity {
  public direction: AnimationDirection = 'down';
  public cameraCoordinates: ICameraCoordinates;
  public id: string;
  public name: string;
  public channelId: string;
  public isMoving: boolean;

  constructor(
    scene: ComponentsScene,
    id: string,
    name: string,
    x: number,
    y: number,
    direction: AnimationDirection,
    cameraCoordinates: ICameraCoordinates,
    texture: string,
    channelId: string,
    isMoving: boolean
  ) {
    super(scene, x, y, texture, MainSceneData.assets);

    this.scene = scene;
    this.direction = direction;
    this.id = id;
    this.name = name;
    this.channelId = channelId;
    this.isMoving = isMoving;
    this.direction = direction;
    this.cameraCoordinates = cameraCoordinates;

    console.log(`💡 Other player(${this.name}) id ${this.id} has been created and added to position: ${x}, ${y}`);

    MainScene.otherPlayers.push(this);

    // this is just networking information
    MainScene.otherPlayersInView.push({
      id: this.id,
      name: this.name,
      x: Math.round(this.x),
      y: Math.round(this.y),
      channelId: this.channelId,
      direction: this.direction,
      isMoving: this.isMoving,
      cameraCoordinates: this.cameraCoordinates,
    });

    this.setDisplayOrigin(GRID_WIDTH, GRID_HEIGHT);

    scene.components.addComponent(this, new OtherPlayerMovement(this.direction));
    scene.components.addComponent(this, new PlayerDebug());
    scene.components.addComponent(this, new PlayerUI());
  }

  destroy(fromScene?: boolean): void {
    MainScene.grid.removeCharacter(this.id);
    MainScene.otherPlayersInView = MainScene.otherPlayersInView.filter((p) => p.id !== this.id);
    MainScene.otherPlayers = MainScene.otherPlayers.filter((p) => p.id !== this.id);

    const scene = this.scene as ComponentsScene;

    scene.components.clearComponent(this);

    super.destroy(fromScene);
  }
}
