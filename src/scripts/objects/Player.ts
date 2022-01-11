import { MainSceneData } from '../../../typings/MainSceneTypes';
import { RigidBody } from '../abstractions/RigidBody';
import MainScene from '../scenes/mainScene';

export class Player extends RigidBody {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers(MainSceneData.assets.dude.key, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'turn',
      frames: [{ key: MainSceneData.assets.dude.key, frame: 4 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers(MainSceneData.assets.dude.key, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.physics.add.overlap(this, MainScene.stars, this.collectStar, undefined, this);
  }

  public movements() {
    if (this.cursors.left.isDown) {
      this.setVelocityX(-160);

      this.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(160);

      this.anims.play('right', true);
    } else {
      this.setVelocityX(0);

      this.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-330);
    }
  }

  private collectStar(player, star) {
    star.disableBody(true, true);
    MainScene.scoreLabel.add(10);
  }
}
