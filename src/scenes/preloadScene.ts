import { MainSceneData } from '../constants/scenes/MainSceneData';
import { maps } from '../maps/maps';
import { PreloadSceneData } from '../typings/PreloadSceneTypes';

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

    // preload maps assets

    for (const map of maps) {
      this.load.image(map.imageKey, map.imagePath);
      this.load.tilemapTiledJSON(map.JSONKey, map.jsonPath);
    }

    this.load.atlas('characters', 'assets/atlas/characters/characters.png', 'assets/atlas/characters/characters.json');
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
