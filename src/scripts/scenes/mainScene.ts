import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { Player } from '../objects/Player';

export default class MainScene extends Phaser.Scene {
  private player: Player;

  constructor() {
    super({ key: MainSceneData.key });
  }

  create() {
    this.player = new Player(this, 100, 200, MainSceneData.assets.player.key);
  }

  update() {
    this.player.movements();
  }
}
