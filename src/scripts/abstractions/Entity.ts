export class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // add it to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);

    this.setCollideWorldBounds(true);
  }
}
