import { MainSceneData } from '../../../typings/MainSceneTypes';
import ScoreLabel from '../../UI/ScoreLabel';
import FpsText from '../objects/fpsText';
import { Player } from '../objects/Player';

export default class MainScene extends Phaser.Scene {
  private fpsText: Phaser.GameObjects.Text;
  private player: Player;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  public static stars: Phaser.Physics.Arcade.Group;
  public static scoreLabel: ScoreLabel;

  constructor() {
    super({ key: MainSceneData.key });
  }

  create() {
    // Game

    this.add.image(400, 300, 'sky');

    this.cursors = this.input.keyboard.createCursorKeys();
    const platforms = this.createPlatforms();
    MainScene.stars = this.createStars();
    this.player = new Player(this, 500, 300, MainSceneData.assets.dude.key);

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(MainScene.stars, platforms);

    MainScene.scoreLabel = this.createScoreLabel(16, 16, 0);

    // Debug

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
    this.player.movements();
  }

  private createPlatforms() {
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, MainSceneData.assets.ground.key).setScale(2).refreshBody();
    platforms.create(600, 400, MainSceneData.assets.ground.key);
    platforms.create(50, 250, MainSceneData.assets.ground.key);
    platforms.create(750, 220, MainSceneData.assets.ground.key);

    return platforms;
  }

  private createStars() {
    const stars = this.physics.add.group({
      key: MainSceneData.assets.star.key,
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((child) => {
      //@ts-ignore
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    return stars;
  }

  private createScoreLabel(x: number, y: number, score: number) {
    const style = { fontSize: '24px', fill: 'white', fontFamily: 'Arial' };
    const label = new ScoreLabel(this, x, this.cameras.main.height - 32, score, style);

    return label;
  }
}
