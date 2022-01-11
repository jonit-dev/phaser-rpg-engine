import FpsText from '../objects/fpsText';

export default class GameScene extends Phaser.Scene {
  fpsText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {}

  create() {
    this.fpsText = new FpsText(this);

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        //@ts-ignore
        fontSize: 14,
      })
      .setOrigin(1, 0);
  }

  update() {
    this.fpsText.update();
  }
}
