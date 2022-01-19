import { PLAYER_START_POS_X, PLAYER_START_POS_Y } from '../constants/playerConstants';
import { MainSceneData } from '../constants/scenes/MainSceneData';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../constants/worldConstants';
import { Camera } from '../objects/Camera';
import { GridManager } from '../objects/GridManager';
import { DesertMapTileset } from '../objects/maps/DesertTileset';
import { OtherPlayer } from '../objects/Players/OtherPlayer';
import { Player } from '../objects/Players/Player';

export default class MainScene extends Phaser.Scene {
  private player: Player;
  public static camera: Camera;
  public gridEngine;
  private map: DesertMapTileset;
  public static grid;
  public static otherPlayers: OtherPlayer[] = [];

  constructor() {
    super({ key: MainSceneData.key });
  }

  create() {
    this.map = new DesertMapTileset(this); // should come before player rendering, to avoid overlap
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT); //map size limits

    new GridManager(this, this.gridEngine, this.map.tilemap);

    this.player = new Player(this, PLAYER_START_POS_X, PLAYER_START_POS_Y, MainSceneData.assets.player.textureKey);
    MainScene.camera = new Camera(this, this.player);

    setTimeout(() => {
      //! This is necessary because the camera starts with 0,0,0,0 bounds at the first frame. So we cannot send this info to the server until we have it properly setup!
      this.player.sendCreateSocketEvents();
      this.player.onUpdateSocketEvents();
    }, 100);
  }
}
