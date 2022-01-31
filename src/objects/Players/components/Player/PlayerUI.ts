import { IComponent } from '../../../../abstractions/ComponentService';
import { MapLayers } from '../../../../typings/MapsTypes';
import { Player } from '../../Player';

export class PlayerUI implements IComponent {
  private gameObject: Player;
  private coordinatesText: Phaser.GameObjects.Text;

  public init(targetObject: Player) {
    this.gameObject = targetObject;
  }

  public awake() {
    this.coordinatesText = this.gameObject.scene.add.text(0, 0, '', {
      color: 'red',
    });
    this.coordinatesText.setDepth(MapLayers.OverPlayer);
  }

  public start() {}

  public update() {
    if (this.gameObject && this.coordinatesText) {
      this.coordinatesText.text = `${this.gameObject.name} | ${Math.round(this.gameObject.x)}, ${Math.round(
        this.gameObject.y
      )}`;
      this.coordinatesText.x = this.gameObject.x - this.coordinatesText.width / 2;
      this.coordinatesText.y = this.gameObject.y - this.coordinatesText.height * 2;
    }
  }

  public destroy() {
    if (this.coordinatesText) {
      this.coordinatesText.destroy();
    }
  }
}
