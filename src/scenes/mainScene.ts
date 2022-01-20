import { ComponentsScene } from '../abstractions/CustomScene';
import { PLAYER_START_POS_X, PLAYER_START_POS_Y } from '../constants/playerConstants';
import { MainSceneData } from '../constants/scenes/MainSceneData';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../constants/worldConstants';
import { DesertMapTileset } from '../maps/DesertTileset';
import { CustomCamera } from '../objects/CustomCamera';
import { GridManager } from '../objects/GridManager';
import { OtherPlayer } from '../objects/Players/OtherPlayer';
import { Player } from '../objects/Players/Player';

export default class MainScene extends ComponentsScene {
  private player: Player;
  public static camera: CustomCamera;
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
  }
}
