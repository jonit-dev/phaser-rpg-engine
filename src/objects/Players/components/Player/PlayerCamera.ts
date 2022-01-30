import { IComponent } from '../../../../abstractions/ComponentService';
import {
  CAMERA_VIEWPORT_HEIGHT,
  CAMERA_VIEWPORT_OFFSET_X,
  CAMERA_VIEWPORT_WIDTH,
  GRID_HEIGHT,
  GRID_WIDTH,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from '../../../../constants/worldConstants';
import { Player } from '../../Player';

export class PlayerCamera implements IComponent {
  private gameObject: Player;
  public scene: Phaser.Scene;
  private camera: Phaser.Cameras.Scene2D.Camera;
  public static worldViewWithOffset: Phaser.Geom.Rectangle;
  private debugWorldView: Phaser.GameObjects.Rectangle;
  private debugMode: boolean = false;
  private debugGrid: Phaser.GameObjects.Grid;

  public init(targetObject: Player) {
    this.gameObject = targetObject;
    this.scene = this.gameObject.scene;
  }

  public start() {
    this.camera = new Phaser.Cameras.Scene2D.Camera(0, 0, CAMERA_VIEWPORT_WIDTH, CAMERA_VIEWPORT_HEIGHT);
    this.scene.cameras.addExisting(this.camera, true);
    this.camera.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.camera.startFollow(this.gameObject);
    this.camera.setLerp(0.5);
    this.renderWorldviewWithOffset();

    this.onRenderDebugInfo();
    this.camera.roundPixels = true; //! This MUST be after startFollow method, otherwise it won't work

    this.debugGrid = this.scene.add.grid(
      this.camera.worldView.x,
      this.camera.worldView.y,
      this.camera.worldView.width,
      this.camera.worldView.height,
      GRID_WIDTH,
      GRID_HEIGHT,
      0x00ff,
      0.4
    );
    this.debugGrid.setDepth(4);
  }

  public update() {
    this.camera.centerOn(this.gameObject.x, this.gameObject.y);
    this.renderWorldviewWithOffset();

    if (this.debugMode) {
      this.onRenderDebugInfo();
    }
    this.debugGrid.x = this.camera.worldView.x;
    this.debugGrid.y = this.camera.worldView.y;
    this.debugGrid.width = this.camera.worldView.width;
    this.debugGrid.height = this.camera.worldView.height;
  }

  private renderWorldviewWithOffset() {
    if (!PlayerCamera.worldViewWithOffset) {
      PlayerCamera.worldViewWithOffset = new Phaser.Geom.Rectangle(
        this.camera.worldView.x,
        this.camera.worldView.y,
        this.camera.worldView.width,
        this.camera.worldView.height
      );
    } else {
      if (this.debugMode) {
        PlayerCamera.worldViewWithOffset.x = this.camera.worldView.x + GRID_WIDTH;
        PlayerCamera.worldViewWithOffset.y = this.camera.worldView.y + GRID_HEIGHT;
        PlayerCamera.worldViewWithOffset.width = this.camera.worldView.width - GRID_WIDTH * 2;
        PlayerCamera.worldViewWithOffset.height = this.camera.worldView.height - GRID_HEIGHT * 2;
      } else {
        PlayerCamera.worldViewWithOffset.x = this.camera.worldView.x - CAMERA_VIEWPORT_OFFSET_X;
        PlayerCamera.worldViewWithOffset.y = this.camera.worldView.y - CAMERA_VIEWPORT_OFFSET_X;
        PlayerCamera.worldViewWithOffset.width = this.camera.worldView.width + CAMERA_VIEWPORT_OFFSET_X;
        PlayerCamera.worldViewWithOffset.height = this.camera.worldView.height + CAMERA_VIEWPORT_OFFSET_X;
      }
    }
  }

  private onRenderDebugInfo() {
    if (!this.debugWorldView) {
      this.debugWorldView = this.scene.add.rectangle(
        PlayerCamera.worldViewWithOffset.x,
        PlayerCamera.worldViewWithOffset.y,
        PlayerCamera.worldViewWithOffset.width,
        PlayerCamera.worldViewWithOffset.height,
        0x00ff00,
        0.5
      );
    } else {
      this.debugWorldView.x = PlayerCamera.worldViewWithOffset.x;
      this.debugWorldView.y = PlayerCamera.worldViewWithOffset.y;
      this.debugWorldView.width = PlayerCamera.worldViewWithOffset.width;
      this.debugWorldView.height = PlayerCamera.worldViewWithOffset.height;
    }
  }
}
