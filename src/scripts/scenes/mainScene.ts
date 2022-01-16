import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../../constants/worldConstants';
import { Camera } from '../objects/Camera';
import { DesertMapTileset } from '../objects/maps/DesertTileset';
import { Player } from '../objects/Player';

export default class MainScene extends Phaser.Scene {
  private player: Player;
  private camera: Camera;
  private tileset: DesertMapTileset;

  constructor() {
    super({ key: MainSceneData.key });
  }

  create() {
    this.tileset = new DesertMapTileset(this); // should come before player rendering, to avoid overlap
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.player = new Player(this, WORLD_WIDTH / 2, WORLD_HEIGHT / 2, MainSceneData.assets.player.textureKey);

    this.camera = new Camera(this, this.player);
  }

  update() {
    this.player.movements();
  }
}
