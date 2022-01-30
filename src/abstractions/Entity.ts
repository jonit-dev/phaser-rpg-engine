import { AnimationDirection, IAnimationData } from '../typings/AnimationTypes';
import { IAssetData } from '../typings/AssetTypes';
import { MapLayers } from '../typings/MapsTypes';
import { ComponentsScene } from './ComponentsScene';

export class Entity extends Phaser.Physics.Arcade.Sprite {
  private assetData: IAssetData;
  private textureKey: string;
  public speed = 4; //default

  constructor(scene: ComponentsScene, x: number, y: number, textureKey: string, assetData: IAssetData) {
    super(scene, x, y, textureKey);

    this.textureKey = textureKey;

    // add it to the scene
    this.scene.add.existing(this);

    // this.setCollideWorldBounds(true);

    // default layer for every entity
    this.setDepth(MapLayers.Player);

    this.assetData = assetData;
    this.setupAnimations(this.assetData[textureKey].animations);
  }

  private setupAnimations(animationData: IAnimationData) {
    for (const [direction, data] of Object.entries(animationData)) {
      this.scene.anims.create({
        key: `${this.textureKey}_${direction}_walking`,
        frames: this.scene.anims.generateFrameNumbers(this.assetData[this.textureKey].textureKey, {
          start: data.walking[0],
          end: data.walking[1],
        }),
        frameRate: 6,
        repeat: -1,
        yoyo: true,
      });

      this.scene.anims.create({
        key: `${this.textureKey}_${direction}_standing`,
        frames: this.scene.anims.generateFrameNumbers(this.assetData[this.textureKey].textureKey, {
          start: data.standing as number,
        }),
        frameRate: 2,
        repeat: -1,
        yoyo: true,
      });
    }
  }

  public playAnimations(direction: AnimationDirection, isMoving: boolean) {
    if (direction) {
      if (isMoving) {
        this.anims.play(`${this.textureKey}_${direction}_walking`, true);
      } else {
        this.anims.play(`${this.textureKey}_${direction}_standing`, false);
      }
    } else {
      this.anims.play(`${this.textureKey}_down_standing`, false);
    }
  }
}
