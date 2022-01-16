import { AnimationDirection } from '../../../typings/AnimationTypes';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { Entity as Entity } from '../abstractions/Entity';

export class Player extends Entity {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: AnimationDirection = 'down';

  public speed: number = 200;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, MainSceneData.assets);

    this.cursors = this.scene.input.keyboard.createCursorKeys();
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
}
