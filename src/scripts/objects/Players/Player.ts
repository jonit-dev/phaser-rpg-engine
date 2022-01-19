import { animals, uniqueNamesGenerator } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import { AnimationDirection } from '../../../typings/AnimationTypes';
import { Entity } from '../../abstractions/Entity';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { geckosClientHelper } from '../../game';
import MainScene from '../../scenes/mainScene';
import {
  PlayerCoordinatesSync,
  PlayerGeckosEvents,
  PlayerLogoutPayload,
  PlayerPositionPayload,
} from '../../types/PlayerTypes';
import { OtherPlayer } from './OtherPlayer';

export class Player extends Entity {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: AnimationDirection = 'down';
  public speed: number = 20;
  public static id = uuidv4();
  public name: string;
  private coordinatesText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, MainSceneData.assets);

    this.name = uniqueNamesGenerator({
      dictionaries: [animals], // colors can be omitted here as not used
      length: 1,
    }); // big-donkey

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.handleSocketEvents();

    this.coordinatesText = scene.add.text(0, 0, '', {
      color: 'red',
    });
    scene.add.container(0, 0, [this, this.coordinatesText]);

    console.log(`Player id ${Player.id} has been created`);
  }

  public onSubscribeToEvents() {
    MainScene.grid.movementStarted().subscribe(({ charId, direction }) => {
      if (charId === 'player') {
        const gridPosition = MainScene.grid.getPosition('player');

        console.log(gridPosition);

        geckosClientHelper.channel.emit(PlayerGeckosEvents.PositionUpdate, {
          id: Player.id,
          x: gridPosition.x,
          y: gridPosition.y,
          direction,
          name: this.name,
          channelId: geckosClientHelper.channelId,
          isMoving: true,
        } as PlayerPositionPayload);
      }
    });

    MainScene.grid.movementStopped().subscribe(({ charId, direction }) => {
      if (charId === 'player') {
        const gridPosition = MainScene.grid.getPosition('player');

        geckosClientHelper.channel.emit(PlayerGeckosEvents.CoordinateSync, {
          id: Player.id,
          x: gridPosition.x,
          y: gridPosition.y,
        } as PlayerCoordinatesSync);
      }
    });
  }

  public onPlayerUpdate() {
    const gridPosition = MainScene.grid.getPosition('player');

    this.coordinatesText.text = `${this.name} | ${gridPosition.x}, ${gridPosition.y}`;
    this.coordinatesText.x = this.x - this.coordinatesText.width / 2;
    this.coordinatesText.y = this.y - this.coordinatesText.height / 2;
  }

  public movements(gridEngine) {
    if (this.cursors.up.isDown && !gridEngine.isMoving('player')) {
      gridEngine.move('player', 'up');
      this.direction = 'up';
    } else if (this.cursors.down.isDown && !gridEngine.isMoving('player')) {
      this.direction = 'down';
      gridEngine.move('player', 'down');
    } else if (this.cursors.left.isDown && !gridEngine.isMoving('player')) {
      this.direction = 'left';
      gridEngine.move('player', 'left');
    } else if (this.cursors.right.isDown && !gridEngine.isMoving('player')) {
      this.direction = 'right';
      gridEngine.move('player', 'right');
    }

    this.playAnimations(this.direction, gridEngine.isMoving('player'));
  }

  public handleSocketEvents() {
    // when creating a new player instance, warn the server so other players can be notified
    geckosClientHelper.channel.emit(PlayerGeckosEvents.Create, {
      id: Player.id,
      name: this.name,
      channelId: geckosClientHelper.channelId,
      x: this.x,
      y: this.y,
      direction: this.direction,
      isMoving: false,
    } as PlayerPositionPayload);

    // when receiving a new player creation event, lets create his instance

    geckosClientHelper.channel.on(PlayerGeckosEvents.Create, (d) => {
      const data = d as PlayerPositionPayload;
      console.log(`Event ${PlayerGeckosEvents.Create} received with data: ${JSON.stringify(data)}`);

      const otherPlayer = new OtherPlayer(
        this.scene as MainScene,
        data.id,
        data.name,
        data.x,
        data.y,
        data.direction as AnimationDirection,
        'player'
      );

      MainScene.otherPlayers.push(otherPlayer);
    });

    geckosClientHelper.channel.on(PlayerGeckosEvents.PrivateMessage, (data) => {
      console.log(data);
    });

    // if received position update event, but other player wasn't created yet, create it
    geckosClientHelper.channel.on(PlayerGeckosEvents.PositionUpdate, (d) => {
      const data = d as PlayerPositionPayload;

      const foundPlayer = MainScene.otherPlayers.find((p) => p.id === data.id);

      if (!foundPlayer) {
        const otherPlayer = new OtherPlayer(
          this.scene as MainScene,
          data.id,
          data.name,
          data.x,
          data.y,
          data.direction as AnimationDirection,
          'player'
        );
        MainScene.otherPlayers.push(otherPlayer);
      }
    });

    geckosClientHelper.channel.on(PlayerGeckosEvents.Logout, (d) => {
      console.log(`Received Logout event: ${JSON.stringify(d)}`);
      const data = d as PlayerLogoutPayload;

      const foundPlayer = MainScene.otherPlayers.find((p) => p.id === data.id);

      if (foundPlayer) {
        foundPlayer.destroy();
      }
    });
  }
}
