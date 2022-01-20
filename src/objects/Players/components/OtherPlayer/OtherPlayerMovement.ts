import { IComponent } from '../../../../abstractions/ComponentService';
import { GRID_HEIGHT, GRID_WIDTH } from '../../../../constants/worldConstants';
import MainScene from '../../../../scenes/mainScene';
import { AnimationDirection } from '../../../../typings/AnimationTypes';
import { OtherPlayer } from '../../OtherPlayer';

export class OtherPlayerMovement implements IComponent {
  private gameObject: OtherPlayer;
  private direction: AnimationDirection = 'down';
  private speed: number = 2;

  public init(targetObject: OtherPlayer) {
    this.gameObject = targetObject;
  }

  public awake() {
    MainScene.grid.addCharacter({
      id: this.gameObject.id,
      sprite: this.gameObject,
      startPosition: {
        x: Math.round(this.gameObject.x / GRID_WIDTH),
        y: Math.round(this.gameObject.y / GRID_HEIGHT),
      },
      speed: this.speed,
    });
  }

  public start() {}

  public update() {}
}
