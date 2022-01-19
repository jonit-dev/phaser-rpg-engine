import { AnimationDirection } from '../../../typings/AnimationTypes';
import { Entity as Entity } from '../../abstractions/Entity';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { GRID_HEIGHT, GRID_WIDTH } from '../../constants/worldConstants';
import { geckosClientHelper } from '../../game';
import MainScene from '../../scenes/mainScene';
import { PlayerGeckosEvents, PlayerPositionPayload } from '../../types/PlayerTypes';

export class OtherPlayer extends Entity {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: AnimationDirection = 'down';
  public speed: number = 2;
  private coordinatesText: Phaser.GameObjects.Text;
  public id: string;
  public name: string;

  constructor(
    scene: MainScene,
    id: string,
    name: string,
    x: number,
    y: number,
    direction: AnimationDirection,
    texture: string
  ) {
    super(scene, x, y, texture, MainSceneData.assets);

    this.scene = scene;
    this.direction = direction;
    this.id = id;
    this.name = name;

    MainScene.grid.addCharacter({
      id,
      sprite: this,
      startPosition: {
        x,
        y,
      },
      speed: this.speed,
    });

    this.coordinatesText = scene.add.text(0, 0, '', {
      color: 'red',
    });

    scene.add.container(0, 0, [this, this.coordinatesText]);

    console.log(`💡 Other player(${this.name}) id ${this.id} has been created and added to position: ${x}, ${y}`);

    this.handleSocketEvents();

    this.scene.events.addListener('update', this.onUpdate, this); // this should be called inside the scene
  }

  public onUpdate() {
    if (MainScene.grid.hasCharacter(this.id)) {
      this.animations();
      this.updateCoordinateTexts();

      // delete itself if too far, to preserve memory
      const isOnView = MainScene.camera.worldViewWithOffset.contains(this.x + this.width / 2, this.y + this.height / 2);

      if (!isOnView) {
        this.destroy();
        console.log(`destroying other player out of view: ${this.id}`);
      }
    }
  }

  destroy(fromScene?: boolean): void {
    MainScene.grid.removeCharacter(this.id);
    MainScene.otherPlayers = MainScene.otherPlayers.filter((p) => p.id !== this.id);
    this.coordinatesText.destroy();
    this.scene.events.removeListener('update', this.onUpdate, this); // remove this listener, otherwise the game will crash once the object is destroyed and it tries to animate it
    super.destroy(fromScene);
  }

  public handleSocketEvents() {
    geckosClientHelper.channel.on(PlayerGeckosEvents.PositionUpdate, (d) => {
      const data = d as PlayerPositionPayload;

      if (data.id === this.id) {
        console.log(`received position update for other player ${data.id}`);
        console.log('pos', data);

        this.x = data.x * GRID_WIDTH;
        this.y = data.y * GRID_HEIGHT;

        MainScene.grid.setPosition(this.id, {
          x: data.x,
          y: data.y,
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

  public updateCoordinateTexts() {
    const gridPosition = MainScene.grid.getPosition(this.id);

    this.coordinatesText.text = `${this.name} ${gridPosition.x}, ${gridPosition.y}`;
    this.coordinatesText.x = this.x - this.coordinatesText.width / 2;
    this.coordinatesText.y = this.y - this.coordinatesText.height / 2;
  }
}
