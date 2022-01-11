export class RigidBody extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // add it to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
  }
}
