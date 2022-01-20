import { animals, uniqueNamesGenerator } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import { AnimationDirection } from '../../../typings/AnimationTypes';
import { Entity } from '../../abstractions/Entity';
import { PLAYER_START_POS_X, PLAYER_START_POS_Y } from '../../constants/playerConstants';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { geckosClientHelper } from '../../game';
import MainScene from '../../scenes/mainScene';
import { IConnectedPlayer, PlayerGeckosEvents, PlayerLogoutPayload } from '../../types/PlayerTypes';
import { OtherPlayer } from './OtherPlayer';

export class Player extends Entity {
  public static id = uuidv4();
  public static speed = 2; //tiles per second
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: AnimationDirection = 'down';
  public name: string;
  private coordinatesText: Phaser.GameObjects.Text;
  private canMove = true;
  private movementIntervalSpeed = 25; //in ms
  public static body;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, MainSceneData.assets);

    this.name = uniqueNamesGenerator({
      dictionaries: [animals],
      length: 1,
    });
    Player.body = this;

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.coordinatesText = scene.add.text(0, 0, '', {
      color: 'red',
    });
    scene.add.container(0, 0, [this, this.coordinatesText]);

    console.log(`Player id ${Player.id} has been created`);

    this.scene.events.addListener('update', this.onPlayerUpdate, this);

    MainScene.grid.addCharacter({
      id: 'player',
      sprite: this,
      // walkingAnimationMapping: 6,
      startPosition: {
        x: PLAYER_START_POS_X,
        y: PLAYER_START_POS_Y,
      },
      speed: Player.speed,
      // charLayer: 'ground',
    });

    MainScene.camera.startFollow(Player.body);
    MainScene.camera.roundPixels = true; //! This MUST be after startFollow method, otherwise it won't work

    MainScene.camera.centerOn(this.x, this.y);
    MainScene.camera.followOffset.set(MainScene.camera.worldView.width / 2, MainScene.camera.worldView.height / 2);
  }

  private onPlayerUpdate() {
    const gridPosition = MainScene.grid.getPosition('player');

    this.coordinatesText.text = `${this.name} | ${gridPosition.x}, ${gridPosition.y}`;
    this.coordinatesText.x = this.x - this.coordinatesText.width / 2;
    this.coordinatesText.y = this.y - this.coordinatesText.height / 2;

    this.movements(MainScene.grid);
  }

  public onUpdateSocketEvents() {
    MainScene.grid.movementStarted().subscribe(({ charId, direction }) => {
      if (charId === 'player') {
        this.canMove = false;

        geckosClientHelper.channel.emit(PlayerGeckosEvents.PlayerPositionUpdate, {
          id: Player.id,
          x: this.x,
          y: this.y,
          direction,
          name: this.name,
          channelId: geckosClientHelper.channelId,
          isMoving: true,
          cameraCoordinates: {
            x: MainScene.camera.worldViewWithOffset.x,
            y: MainScene.camera.worldViewWithOffset.y,
            width: MainScene.camera.worldViewWithOffset.width,
            height: MainScene.camera.worldViewWithOffset.height,
          },
        } as IConnectedPlayer);
      }
    });

    MainScene.grid.movementStopped().subscribe(({ charId, direction }) => {
      if (charId === 'player') {
        setTimeout(() => {
          this.canMove = true;
        }, this.movementIntervalSpeed);
      }
    });
  }

  private movements(gridEngine) {
    if (this.canMove) {
      const gridPosition = MainScene.grid.getPosition('player');

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
    }

    this.playAnimations(this.direction, gridEngine.isMoving('player'));
  }

  public sendCreateSocketEvents() {
    // when creating a new player instance, warn the server so other players can be notified

    geckosClientHelper.channel.emit(
      PlayerGeckosEvents.PlayerCreate,
      {
        id: Player.id,
        name: this.name,
        channelId: geckosClientHelper.channelId,
        x: this.x,
        y: this.y,
        direction: this.direction,
        isMoving: false,
        cameraCoordinates: {
          x: MainScene.camera.worldViewWithOffset.x,
          y: MainScene.camera.worldViewWithOffset.y,
          width: MainScene.camera.worldViewWithOffset.width,
          height: MainScene.camera.worldViewWithOffset.height,
        },
      } as IConnectedPlayer,
      {
        reliable: true,
      }
    );
    // when receiving a new player creation event, lets create his instance

    geckosClientHelper.channel.on(PlayerGeckosEvents.PlayerCreate, (d) => {
      const data = d as IConnectedPlayer;
      console.log(`Event ${PlayerGeckosEvents.PlayerCreate} received with data: ${JSON.stringify(data)}`);

      const otherPlayer = new OtherPlayer(
        this.scene as MainScene,
        data.id,
        data.name,
        data.x,
        data.y,
        data.direction as AnimationDirection,
        data.cameraCoordinates,
        'player'
      );

      MainScene.otherPlayers.push(otherPlayer);
    });

    geckosClientHelper.channel.on(PlayerGeckosEvents.PlayerPrivateMessage, (data) => {
      console.log(data);
    });

    // if received position update event, but other player wasn't created yet, create it
    geckosClientHelper.channel.on(PlayerGeckosEvents.PlayerPositionUpdate, (d) => {
      const data = d as IConnectedPlayer;

      const foundPlayer = MainScene.otherPlayers.find((p) => p.id === data.id);

      if (!foundPlayer) {
        const otherPlayer = new OtherPlayer(
          this.scene as MainScene,
          data.id,
          data.name,
          data.x,
          data.y,
          data.direction as AnimationDirection,
          data.cameraCoordinates,
          'player'
        );
        MainScene.otherPlayers.push(otherPlayer);
      }
    });

    geckosClientHelper.channel.on(PlayerGeckosEvents.PlayerLogout, (d) => {
      console.log(`Received Logout event: ${JSON.stringify(d)}`);
      const data = d as PlayerLogoutPayload;

      const foundPlayer = MainScene.otherPlayers.find((p) => p.id === data.id);

      if (foundPlayer) {
        foundPlayer.destroy();
      }
    });
  }
}
