import { AnimationDirection } from '../../../typings/AnimationTypes';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { Entity as Entity } from '../abstractions/Entity';

export class Player extends Entity {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: AnimationDirection = 'down';
  private isMoving: boolean = false;
  private animationsData = MainSceneData.assets.player.animations;
  private speed: number = 200;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, MainSceneData.assets);

    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  public movements() {
    if (this.cursors.up.isDown) {
      this.setVelocityY(-this.speed);
      this.direction = 'up';
      this.isMoving = true;
    } else if (this.cursors.down.isDown) {
      this.setVelocityY(this.speed);
      this.direction = 'down';
      this.isMoving = true;
    } else if (this.cursors.left.isDown) {
      this.setVelocityX(-this.speed);
      this.direction = 'left';
      this.isMoving = true;
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(this.speed);
      this.direction = 'right';
      this.isMoving = true;
    } else {
      this.setVelocityX(0);
      this.setVelocityY(0);
      this.anims.stop();
      this.isMoving = false;
    }

    this.playAnimations(this.direction, this.isMoving);
  }
}
