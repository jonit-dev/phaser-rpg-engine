import {
  CAMERA_VIEWPORT_OFFSET_X,
  CAMERA_VIEWPORT_OFFSET_Y,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from '../constants/worldConstants';
import { Player } from './Players/Player';

export class Camera {
  private camera: Phaser.Cameras.Scene2D.Camera;
  public extendedView: () => Phaser.Geom.Rectangle;
  public worldViewWithOffset: Phaser.Geom.Rectangle;
  public representation: Phaser.GameObjects.Rectangle;
  private debugText: Phaser.GameObjects.Text;
  private player: Player;
  private scene: Phaser.Scene;
  private debugMode: boolean = true;

  constructor(scene: Phaser.Scene, player: Player) {
    this.player = player;
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.camera.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.extendedView = () => {
      return new Phaser.Geom.Rectangle(
        this.camera.worldView.x,
        this.camera.worldView.y,
        this.camera.worldView.width,
        this.camera.worldView.height
      );
    };

    this.worldViewWithOffset = this.extendedView();

    if (this.debugMode) {
      this.drawDebugInfo(this.scene);
    }

    scene.events.addListener('update', this.onUpdate, this);

    this.startFollowingPlayer();
  }

  private startFollowingPlayer() {
    this.camera.startFollow(this.player);
    this.camera.roundPixels = true; //! This MUST be after startFollow method, otherwise it won't work
  }

  private onUpdate() {
    this.worldViewWithOffset.x = this.camera.worldView.x - CAMERA_VIEWPORT_OFFSET_X;
    this.worldViewWithOffset.y = this.camera.worldView.y - CAMERA_VIEWPORT_OFFSET_Y;
    this.worldViewWithOffset.width = this.camera.worldView.width + CAMERA_VIEWPORT_OFFSET_X * 2;
    this.worldViewWithOffset.height = this.camera.worldView.height + CAMERA_VIEWPORT_OFFSET_Y * 2;

    if (this.debugMode) {
      this.onUpdateDebugInfo();
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
