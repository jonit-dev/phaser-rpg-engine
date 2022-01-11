import { MainSceneData } from '../../../typings/MainSceneTypes';
import FpsText from '../objects/fpsText';

export default class MainScene extends Phaser.Scene {
  fpsText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: MainSceneData.key });
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.add.image(400, 300, 'star');

    this.createPlatforms();

    this.fpsText = new FpsText(this);

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION} - Scene: ${this.scene.key} `, {
        color: '#000000',
        //@ts-ignore
        fontSize: 12,
      })
      .setOrigin(1, 0);
  }

  update() {
    this.fpsText.update();
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, MainSceneData.assets.ground.key).setScale(2).refreshBody();
    platforms.create(600, 400, MainSceneData.assets.ground.key);
    platforms.create(50, 250, MainSceneData.assets.ground.key);
    platforms.create(750, 220, MainSceneData.assets.ground.key);
  }
}
