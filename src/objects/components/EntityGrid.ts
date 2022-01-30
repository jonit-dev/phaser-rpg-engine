import { IComponent } from '../../abstractions/ComponentService';
import { Entity } from '../../abstractions/Entity';
import { PLAYER_START_POS_X, PLAYER_START_POS_Y } from '../../constants/playerConstants';
import { GRID_HEIGHT, GRID_WIDTH } from '../../constants/worldConstants';
import { gridHelper } from '../../libs/GridHelper';
import MainScene from '../../scenes/mainScene';
import { Player } from '../Players/Player';

export class EntityGrid implements IComponent {
  private gameObject: Entity;
  private gridKey: string;

  constructor(gridKey: string) {
    this.gridKey = gridKey;
  }

  public init(targetObject: Player) {
    this.gameObject = targetObject;
  }

  public awake() {
    // this whole offset and displayOrigin adjustments are required because our entity sprites are 32x32 while our tileset is 16x16

    MainScene.grid.addCharacter({
      id: this.gridKey,
      sprite: this.gameObject,
      // walkingAnimationMapping: 6,
      startPosition: {
        x: PLAYER_START_POS_X,
        y: PLAYER_START_POS_Y,
      },
      speed: this.gameObject.speed,
      charLayer: 'player',
      offsetY: 16,
      offsetX: 8,
    });

    // make sure our sprite position and grid position are the same, to avoid inconsistencies
    const { x: gridX, y: gridY } = MainScene.grid.getPosition(this.gridKey);
    const { x, y } = gridHelper.convertToXY(gridX, gridY);
    this.gameObject.x = x;
    this.gameObject.y = y;

    // tweak the display origin to match the grid
    this.gameObject.setDisplayOrigin(GRID_WIDTH, GRID_HEIGHT);
  }
}
