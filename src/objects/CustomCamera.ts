import {
  CAMERA_VIEWPORT_OFFSET_X,
  CAMERA_VIEWPORT_OFFSET_Y,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from '../constants/worldConstants';

export class CustomCamera extends Phaser.Cameras.Scene2D.Camera {
  public extendedView: () => Phaser.Geom.Rectangle;
  public worldViewWithOffset: Phaser.Geom.Rectangle;
  public representation: Phaser.GameObjects.Rectangle;
  private debugText: Phaser.GameObjects.Text;

  public scene: Phaser.Scene;
  private debugMode: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.scene = scene;

    this.scene.cameras.addExisting(this, true);

    this.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.extendedView = () => {
      return new Phaser.Geom.Rectangle(this.worldView.x, this.worldView.y, this.worldView.width, this.worldView.height);
    };

    this.worldViewWithOffset = this.extendedView();

    if (this.debugMode) {
      this.drawDebugInfo(this.scene);
    }

    scene.events.addListener('update', this.onUpdate, this);

    this.setLerp(0.5);
  }

  private onUpdate() {
    if (this.debugMode) {
      this.onUpdateDebugInfo();

      this.worldViewWithOffset.x = this.worldView.x + 32;
      this.worldViewWithOffset.y = this.worldView.y + 32;
      this.worldViewWithOffset.width = this.worldView.width - 64;
      this.worldViewWithOffset.height = this.worldView.height - 64;
    } else {
      this.worldViewWithOffset.x = this.worldView.x - CAMERA_VIEWPORT_OFFSET_X;
      this.worldViewWithOffset.y = this.worldView.y - CAMERA_VIEWPORT_OFFSET_Y;
      this.worldViewWithOffset.width = this.worldView.width + CAMERA_VIEWPORT_OFFSET_X;
      this.worldViewWithOffset.height = this.worldView.height + CAMERA_VIEWPORT_OFFSET_Y;
    }
  }

  private onUpdateDebugInfo() {
    this.representation.x = this.worldViewWithOffset.x;
    this.representation.y = this.worldViewWithOffset.y;
    this.representation.width = this.worldViewWithOffset.width;
    this.representation.height = this.worldViewWithOffset.height;

    this.debugText.text = `x: ${Math.round(this.worldViewWithOffset.x)} | y: ${Math.round(
      this.worldViewWithOffset.y
    )} | width: ${Math.round(this.worldViewWithOffset.width)} | height: ${Math.round(this.worldViewWithOffset.height)}`;
    this.debugText.x = this.representation.x;
    this.debugText.y = this.representation.y;
  }

  private drawDebugInfo(scene: Phaser.Scene) {
    this.representation = scene.add.rectangle(
      this.worldViewWithOffset.x,
      this.worldViewWithOffset.y,
      this.worldViewWithOffset.width,
      this.worldViewWithOffset.height,
      0x00ff00,
      0.5
    );

    this.debugText = scene.add.text(
      this.representation.x,
      this.representation.y,
      `x: ${this.worldViewWithOffset.x} | y: ${this.worldViewWithOffset.y} | w: ${this.worldViewWithOffset.width} | h: ${this.worldViewWithOffset.height}`,
      {
        color: 'red',
      }
    );
  }
}
