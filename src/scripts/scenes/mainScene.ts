import { MainSceneData } from '../../../typings/MainSceneTypes';
import FpsText from '../../UI/fpsText';
import ScoreLabel from '../../UI/ScoreLabel';
import BombSpawner from '../objects/BombSpawner';
import { Player } from '../objects/Player';

export default class MainScene extends Phaser.Scene {
  private fpsText: Phaser.GameObjects.Text;
  private player: Player;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  public static stars: Phaser.Physics.Arcade.Group;
  public static scoreLabel: ScoreLabel;
  public static bombSpawner: BombSpawner;
  private gameOver: boolean = false;

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
    MainScene.bombSpawner = new BombSpawner(this, MainSceneData.assets.bomb.key);

    this.setupColliders(platforms);
    this.setupUI();
  }

  update() {
    this.fpsText.update();
    this.player.movements();

    if (this.gameOver) {
      return;
    }
  }

  private setupColliders(platforms) {
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(MainScene.stars, platforms);
    this.physics.add.collider(MainScene.bombSpawner.group, platforms);
    this.physics.add.collider(this.player, MainScene.bombSpawner.group, this.hitBomb, undefined, this);
  }

  private setupUI() {
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

    MainScene.scoreLabel = this.createScoreLabel(16, 16, 0);
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

  private hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    this.gameOver = true;
  }
}
