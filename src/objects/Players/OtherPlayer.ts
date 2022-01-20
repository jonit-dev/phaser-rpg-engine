import { ComponentsScene } from '../../abstractions/CustomScene';
import { Entity as Entity } from '../../abstractions/Entity';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { GRID_HEIGHT, GRID_WIDTH } from '../../constants/worldConstants';
import { geckosClientHelper } from '../../game';
import MainScene from '../../scenes/mainScene';
import { AnimationDirection } from '../../typings/AnimationTypes';
import { ICameraCoordinates, IConnectedPlayer, PlayerGeckosEvents } from '../../typings/PlayerTypes';
import { OtherPlayerMovement } from './components/OtherPlayer/OtherPlayerMovement';
import { PlayerCamera } from './components/Player/PlayerCamera';

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

    scene.components.addComponent(this, new OtherPlayerMovement());

    console.log(`💡 Other player(${this.name}) id ${this.id} has been created and added to position: ${x}, ${y}`);

    this.handleSocketEvents();

    this.scene.events.addListener('update', this.onUpdate, this); // this should be called inside the scene
  }

  public onUpdate() {
    if (MainScene.grid.hasCharacter(this.id)) {
      this.animations();

      // delete itself if too far, to preserve memory
      const isOnView = PlayerCamera.worldViewWithOffset.contains(this.x, this.y);

      if (!isOnView) {
        this.destroy();
        console.log(`destroying other player out of view: ${this.id}`);
      }
    }
  }

  destroy(fromScene?: boolean): void {
    MainScene.grid.removeCharacter(this.id);
    MainScene.otherPlayers = MainScene.otherPlayers.filter((p) => p.id !== this.id);

    this.scene.events.removeListener('update', this.onUpdate, this); // remove this listener, otherwise the game will crash once the object is destroyed and it tries to animate it
    super.destroy(fromScene);
  }

  public handleSocketEvents() {
    geckosClientHelper.channel.on(PlayerGeckosEvents.PlayerPositionUpdate, (d) => {
      const data = d as IConnectedPlayer;

      if (data.id === this.id) {
        console.log(`received position update for other player ${data.id}`);
        console.log('pos', data);

        this.x = data.x;
        this.y = data.y;

        // this.cameraCoordinates = data.cameraCoordinates; //! REACTIVATE on debug

        MainScene.grid.setPosition(this.id, {
          x: Math.round(data.x / GRID_WIDTH),
          y: Math.round(data.y / GRID_HEIGHT),
        });

        this.direction = data.direction as AnimationDirection;

        if (data.isMoving) {
          MainScene.grid.move(this.id, data.direction);
        }
      }
    });
  }

  public animations() {
    // this avoids crashes if instance is destroyed
    this.playAnimations(this.direction, MainScene.grid.isMoving(this.id));
  }
}
