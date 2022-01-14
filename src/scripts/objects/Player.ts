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
    super(scene, x, y, texture);

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.setupAnimations();
  }

  private setupAnimations() {
    for (const [key, value] of Object.entries(this.animationsData)) {
      this.scene.anims.create({
        key: value.walking.key,
        frames: this.scene.anims.generateFrameNumbers(MainSceneData.assets.player.key, value.walking.frames),
        frameRate: 10,
        repeat: -1,
      });

      this.scene.anims.create({
        key: value.standing.key,
        frames: this.scene.anims.generateFrameNumbers(MainSceneData.assets.player.key, {
          start: value.standing.frame,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  public movements() {
    if (this.cursors.up.isDown) {
      this.setVelocityY(-this.speed);
      this.anims.play('player_up_walking', true);
      this.direction = 'up';
      this.isMoving = true;
    } else if (this.cursors.down.isDown) {
      this.setVelocityY(this.speed);
      this.anims.play('player_down_walking', true);
      this.direction = 'down';
      this.isMoving = true;
    } else if (this.cursors.left.isDown) {
      this.setVelocityX(-this.speed);
      this.anims.play('player_left_walking', true);
      this.direction = 'left';
      this.isMoving = true;
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(this.speed);
      this.anims.play('player_right_walking', true);
      this.direction = 'right';
      this.isMoving = true;
    } else {
      this.setVelocityX(0);
      this.setVelocityY(0);
      this.anims.stop();
      this.isMoving = false;
    }

    // standing animation
    if (!this.isMoving) {
      this.anims.play(`player_${this.direction}_standing`, false);
    }
  }
}
