import { WORLD_HEIGHT, WORLD_WIDTH } from '../../constants/worldConstants';
import { Player } from './Player';

export class Camera {
  private camera: Phaser.Cameras.Scene2D.Camera;

  constructor(scene: Phaser.Scene, player: Player) {
    this.camera = scene.cameras.main;
    this.camera.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.camera.startFollow(player);
    this.camera.roundPixels = true;
  }
}
