import { IComponent } from '../../../abstractions/ComponentService';
import MainScene from '../../../scenes/mainScene';
import { Player } from '../Player';

export class PlayerUI implements IComponent {
  private gameObject: Player;
  private coordinatesText: Phaser.GameObjects.Text;

  public init(targetObject: Player) {
    this.gameObject = targetObject;
  }

  public start() {
    this.coordinatesText = this.gameObject.scene.add.text(0, 0, '', {
      color: 'red',
    });
    this.gameObject.scene.add.container(0, 0, [this.gameObject, this.coordinatesText]);
  }

  public update() {
    const gridPosition = MainScene.grid.getPosition('player');

    this.coordinatesText.text = `${this.gameObject.name} | ${gridPosition.x}, ${gridPosition.y}`;
    this.coordinatesText.x = this.gameObject.x - this.coordinatesText.width / 2;
    this.coordinatesText.y = this.gameObject.y - this.coordinatesText.height / 2;
  }
}
