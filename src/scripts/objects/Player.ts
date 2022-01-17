import { v4 as uuidv4 } from 'uuid';
import { AnimationDirection } from '../../../typings/AnimationTypes';
import { Entity as Entity } from '../abstractions/Entity';
import { MainSceneData } from '../constants/scenes/MainSceneData';
import { geckosClientHelper } from '../game';
import { PlayerCreationPayload, PlayerGeckosEvents } from '../types/PlayerTypes';

export class Player extends Entity {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: AnimationDirection = 'down';
  public speed: number = 200;
  public static id = uuidv4();
  private coordinatesText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, MainSceneData.assets);

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.handleIOEvents();

    this.coordinatesText = scene.add.text(0, 0, '', {
      color: 'red',
    });

    const container = scene.add.container(0, 0, [this, this.coordinatesText]);
  }

  public onPlayerUpdate() {
    this.coordinatesText.text = `Player ${Math.round(this.x)}, ${Math.round(this.y)}`;
    this.coordinatesText.x = this.x - this.coordinatesText.width / 2;
    this.coordinatesText.y = this.y - this.coordinatesText.height / 2;
  }

  public movements(gridEngine) {
    if (this.cursors.up.isDown && !gridEngine.isMoving('player')) {
      gridEngine.move('player', 'up');
      this.direction = 'up';
    } else if (this.cursors.down.isDown && !gridEngine.isMoving('player')) {
      this.direction = 'down';
      gridEngine.move('player', 'down');
    } else if (this.cursors.left.isDown && !gridEngine.isMoving('player')) {
      this.direction = 'left';
      gridEngine.move('player', 'left');
    } else if (this.cursors.right.isDown && !gridEngine.isMoving('player')) {
      this.direction = 'right';
      gridEngine.move('player', 'right');
    }

    this.playAnimations(this.direction, gridEngine.isMoving('player'));
  }

  public handleIOEvents() {
    // when creating a new player instance, warn the server so other players can be notified
    geckosClientHelper.channel.emit(PlayerGeckosEvents.Create, {
      id: Player.id,
      x: this.x,
      y: this.y,
    } as PlayerCreationPayload);

    // when receiving a new player creation event, lets create his instance
    geckosClientHelper.channel.on(PlayerGeckosEvents.Create, (data) => {
      console.log('Someone joined the server! Creating new player instance!', data);
    });
  }
}
