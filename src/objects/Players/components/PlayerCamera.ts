import { IComponent } from '../../../abstractions/ComponentService';
import MainScene from '../../../scenes/mainScene';
import { Player } from '../Player';

export class PlayerCamera implements IComponent {
  private gameObject: Player;

  public init(targetObject: Player) {
    this.gameObject = targetObject;
  }

  public start() {
    const camera = this.gameObject.scene.cameras.main;

    camera.startFollow(this.gameObject);
    camera.roundPixels = true; //! This MUST be after startFollow method, otherwise it won't work
    camera.centerOn(this.gameObject.x, this.gameObject.y);
    camera.followOffset.set(MainScene.camera.worldView.width / 2, MainScene.camera.worldView.height / 2);
    camera.setLerp(0.5);
  }

  public update() {}
}
