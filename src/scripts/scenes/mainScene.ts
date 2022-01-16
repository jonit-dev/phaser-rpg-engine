import { PLAYER_START_POS_X, PLAYER_START_POS_Y } from '../../constants/playerConstants';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../../constants/worldConstants';
import { Camera } from '../objects/Camera';
import { GridManager } from '../objects/GridManager';
import { DesertMapTileset } from '../objects/maps/DesertTileset';
import { Player } from '../objects/Player';

export default class MainScene extends Phaser.Scene {
  private player: Player;
  private camera: Camera;
  private gridEngine;
  private map: DesertMapTileset;

  constructor() {
    super({ key: MainSceneData.key });
  }

  create() {
    this.map = new DesertMapTileset(this); // should come before player rendering, to avoid overlap
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT); //map size limits

    this.player = new Player(this, PLAYER_START_POS_X, PLAYER_START_POS_Y, MainSceneData.assets.player.textureKey);

    this.camera = new Camera(this, this.player);

    new GridManager(this, this.player, this.map.tilemap);
  }

  update() {
    this.player.movements(this.gridEngine);
  }
}
