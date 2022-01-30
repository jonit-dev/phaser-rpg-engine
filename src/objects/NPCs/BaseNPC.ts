import { ComponentsScene } from '../../abstractions/CustomScene';

export class BaseNPC extends Phaser.Physics.Arcade.Sprite {
  public name: string;

  constructor(scene: ComponentsScene, x: number, y: number, texture: string, name: string) {
    super(scene, x, y, texture);

    this.name = name;
  }
}
