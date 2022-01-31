import AnimatedTiles from 'phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js';
import { ComponentsScene } from '../abstractions/ComponentsScene';
import { PLAYER_START_POS_X, PLAYER_START_POS_Y } from '../constants/playerConstants';
import { MainSceneData } from '../constants/scenes/MainSceneData';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../constants/worldConstants';
import { MapLoader } from '../maps/MapLoader';
import { GridManager } from '../objects/GridManager';
import { OtherPlayer } from '../objects/Players/OtherPlayer';
import { Player } from '../objects/Players/Player';
import { IConnectedPlayer } from '../typings/PlayerTypes';

export default class MainScene extends ComponentsScene {
  private player: Player;
  public gridEngine;
  private map: MapLoader;
  public static grid;
  public static otherPlayers: OtherPlayer[] = [];
  public static otherPlayersInView: IConnectedPlayer[] = [];

  constructor() {
    super({ key: MainSceneData.key });
  }

  preload() {
    this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  create() {
    this.map = new MapLoader(this, 'default_map'); // should come before player rendering, to avoid overlap
    //@ts-ignore
    this.sys.animatedTiles.init(this.map.tilemap);

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT); //map size limits
    new GridManager(this, this.gridEngine, this.map.tilemap);
    this.player = new Player(
      this,
      PLAYER_START_POS_X,
      PLAYER_START_POS_Y,
      MainSceneData.assets.player.textureKey,
      this.map.tilemap
    );
  }
}
