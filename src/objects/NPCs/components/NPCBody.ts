import { IComponent } from '../../../abstractions/ComponentService';
import { GRID_HEIGHT, GRID_WIDTH } from '../../../constants/worldConstants';
import MainScene from '../../../scenes/mainScene';
import { IAssetAttributes } from '../../../typings/AssetTypes';
import { BaseNPC } from '../BaseNPC';

export class NPCBody implements IComponent {
  private gameObject: BaseNPC;
  private assetAttributes: IAssetAttributes;
  private speed: number = 2;

  constructor(assetAttributes: IAssetAttributes) {
    this.assetAttributes = assetAttributes;
  }

  public init(targetObject: BaseNPC) {
    this.gameObject = targetObject;
  }

  public awake() {
    this.setupAnimations();

    MainScene.grid.addCharacter({
      id: this.gameObject.name,
      sprite: this.gameObject,
      startPosition: {
        x: this.gameObject.x / GRID_WIDTH,
        y: this.gameObject.y / GRID_HEIGHT,
      },
      speed: this.speed,
    });
  }

  public start() {
    this.gameObject.anims.play('alice_down_walking');
  }

  private setupAnimations() {
    for (const [direction, data] of Object.entries(this.assetAttributes.animations)) {
      const animationBehaviours = ['standing', 'walking'];

      for (const behavior of animationBehaviours) {
        this.gameObject.scene.anims.create({
          key: `${this.gameObject.name}_${direction}_${behavior}`,
          frames: this.gameObject.scene.anims.generateFrameNames(this.assetAttributes.textureKey, {
            prefix: 'tile',
            suffix: '.png',
            start: data.walking[0],
            end: data.walking[1],
            zeroPad: 3,
          }),
          frameRate: 6,
          repeat: -1,
        });
      }
    }
  }
}
