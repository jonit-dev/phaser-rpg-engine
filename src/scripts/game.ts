import 'phaser';
import { CAMERA_VIEWPORT_HEIGHT, CAMERA_VIEWPORT_WIDTH, WORLD_HEIGHT, WORLD_WIDTH } from '../constants/worldConstants';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: 'black',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: CAMERA_VIEWPORT_WIDTH,
    height: CAMERA_VIEWPORT_HEIGHT,
  },
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
});
