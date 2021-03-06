import GridEngine from 'grid-engine';
import 'phaser';
import { CAMERA_VIEWPORT_HEIGHT, CAMERA_VIEWPORT_WIDTH, WORLD_HEIGHT, WORLD_WIDTH } from './constants/worldConstants';
import { GeckosClientHelper } from './libs/GeckosClient/GeckosClientHelper';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';

export const geckosClientHelper = new GeckosClientHelper();

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
  plugins: {
    scene: [
      {
        key: 'gridEngine',
        plugin: GridEngine,
        mapping: 'gridEngine',
      },
    ],
  },
};

window.addEventListener('load', async () => {
  try {
    await geckosClientHelper.init(); // lets make sure we're connected to our server before initializing the game.

    const game = new Phaser.Game(config);
  } catch (error) {
    console.error(error);
    alert('Oops! Failed to connect to server!');
  }
});

window.addEventListener('beforeunload', function (e) {
  geckosClientHelper.disconnect();

  var confirmationMessage = 'Are you sure you want to logout?';

  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  return confirmationMessage; //Webkit, Safari, Chrome
});
