import { PLAYER_START_POS_X, PLAYER_START_POS_Y } from '../constants/playerConstants';
import { MainSceneData } from '../constants/scenes/MainSceneData';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../constants/worldConstants';
import { Camera } from '../objects/Camera';
import { GridManager } from '../objects/GridManager';
import { DesertMapTileset } from '../objects/maps/DesertTileset';
import { Player } from '../objects/Player';

export default class MainScene extends Phaser.Scene {
  private player: Player;
  private camera: Camera;
  public gridEngine;
  private map: DesertMapTileset;
  public static grid;

  constructor() {
    super({ key: MainSceneData.key });
  }

  create() {
    this.map = new DesertMapTileset(this); // should come before player rendering, to avoid overlap
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT); //map size limits
    MainScene.grid = this.gridEngine;

    this.player = new Player(this, PLAYER_START_POS_X, PLAYER_START_POS_Y, MainSceneData.assets.player.textureKey);
    new GridManager(this, this.player, this.map.tilemap);
    this.player.onSubscribeToEvents();

    this.camera = new Camera(this, this.player);

    // this.input.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
    //   const { worldX, worldY } = pointer;

    //   console.log(`Pointer up at ${worldX}, ${worldY}`);

    //   const tile = this.map.tilemap.getTileAtWorldXY(worldX, worldY, true, undefined, '+1');

    //   console.log(`here we have tile`);
    //   console.log(tile);
    //   console.log(tile.x, tile.y);

    //   // use startVec and targetVec
    // });
  }

  update() {
    this.player.movements(this.gridEngine);
    this.player.onPlayerUpdate();
  }
}
