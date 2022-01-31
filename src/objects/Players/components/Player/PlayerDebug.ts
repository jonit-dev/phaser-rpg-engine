import { IComponent } from '../../../../abstractions/ComponentService';
import { GRID_HEIGHT, GRID_WIDTH } from '../../../../constants/worldConstants';
import MainScene from '../../../../scenes/mainScene';
import { Player } from '../../Player';

export class PlayerDebug implements IComponent {
  public gameObject: Player;
  private debugMode: boolean = true;

  private debugCellOrigin;
  private debugGridOrigin;
  private gridKey: string;

  constructor(gridKey: string) {
    this.gridKey = gridKey;
  }

  public init(targetObject: Player) {
    this.gameObject = targetObject;
  }

  public awake() {
    if (this.debugMode) {
      this.debugCellOrigin = this.gameObject.scene.add.rectangle(
        this.gameObject.x,
        this.gameObject.y,
        5,
        5,
        0x00ff,
        0.5
      );
      const gridPos = MainScene.grid.getPosition(this.gridKey);
      this.debugGridOrigin = this.gameObject.scene.add.rectangle(
        gridPos.x * GRID_WIDTH,
        gridPos.y * GRID_HEIGHT,
        5,
        5,
        0x000f,
        0.5
      );
    }

    // check if cellgrid is blocked
  }

  public start() {}

  public update() {
    if (this.debugMode) {
      this.debugCellOrigin.x = this.gameObject.x;
      this.debugCellOrigin.y = this.gameObject.y;

      if (MainScene.grid.hasCharacter(this.gridKey)) {
        const gridPos = MainScene.grid.getPosition(this.gridKey);
        this.debugGridOrigin.x = gridPos.x * GRID_WIDTH;
        this.debugGridOrigin.y = gridPos.y * GRID_HEIGHT;
      }
    }
  }

  public destroy() {
    if (this.debugMode) {
      this.debugCellOrigin.destroy();
      this.debugGridOrigin.destroy();
    }
  }
}
