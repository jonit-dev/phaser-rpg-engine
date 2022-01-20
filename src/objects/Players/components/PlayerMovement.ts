import { IComponent } from '../../../abstractions/ComponentService';
import MainScene from '../../../scenes/mainScene';
import { Player } from '../Player';

export class PlayerMovement implements IComponent {
  private gameObject: Player;
  private coordinatesText: Phaser.GameObjects.Text;
  private cursors;
  private gridEngine = MainScene.grid;

  public init(targetObject: Player) {
    this.gameObject = targetObject;
    this.cursors = this.gameObject.scene.input.keyboard.createCursorKeys();
  }

  public awake() {}

  public start() {}

  public update() {
    if (this.gameObject.canMove) {
      if (this.cursors.up.isDown && !this.gridEngine.isMoving('player')) {
        this.gridEngine.move('player', 'up');
        this.gameObject.direction = 'up';
      } else if (this.cursors.down.isDown && !this.gridEngine.isMoving('player')) {
        this.gameObject.direction = 'down';
        this.gridEngine.move('player', 'down');
      } else if (this.cursors.left.isDown && !this.gridEngine.isMoving('player')) {
        this.gameObject.direction = 'left';
        this.gridEngine.move('player', 'left');
      } else if (this.cursors.right.isDown && !this.gridEngine.isMoving('player')) {
        this.gameObject.direction = 'right';
        this.gridEngine.move('player', 'right');
      }
    }
    this.gameObject.playAnimations(this.gameObject.direction, MainScene.grid.isMoving('player'));
  }
}
