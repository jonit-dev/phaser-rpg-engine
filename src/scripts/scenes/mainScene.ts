import FpsText from '../objects/fpsText';

export default class MainScene extends Phaser.Scene {
  fpsText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.add.image(400, 300, 'star');

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
}
