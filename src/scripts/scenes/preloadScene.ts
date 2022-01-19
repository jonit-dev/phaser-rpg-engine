import { PreloadSceneData } from '../../typings/PreloadSceneTypes';
import { MainSceneData } from '../constants/scenes/MainSceneData';
import { DesertMapTileset } from '../objects/maps/DesertTileset';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: PreloadSceneData.key });
  }

  preload() {
    // this.load.image(MainSceneData.assets.bomb.key, MainSceneData.assets.bomb.path);
    this.load.spritesheet(MainSceneData.assets.player.textureKey, MainSceneData.assets.player.path, {
      frameWidth: 32,
      frameHeight: 32,
    });

    DesertMapTileset.preload(this);
  }

  create() {
    this.scene.start(MainSceneData.key);

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
