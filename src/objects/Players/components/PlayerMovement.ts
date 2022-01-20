import { IComponent } from '../../../abstractions/ComponentService';
import { PLAYER_START_POS_X, PLAYER_START_POS_Y } from '../../../constants/playerConstants';
import { geckosClientHelper } from '../../../game';
import MainScene from '../../../scenes/mainScene';
import { AnimationDirection } from '../../../typings/AnimationTypes';
import { IConnectedPlayer, PlayerGeckosEvents, PlayerLogoutPayload } from '../../../typings/PlayerTypes';
import { OtherPlayer } from '../OtherPlayer';
import { Player } from '../Player';

export class PlayerMovement implements IComponent {
  private gameObject: Player;
  private coordinatesText: Phaser.GameObjects.Text;
  private cursors;
  private gridEngine = MainScene.grid;
  private speed = 2; //tiles per second
  private direction: AnimationDirection = 'down';
  private canMove = true;
  private movementIntervalSpeed = 25; //in ms

  public init(targetObject: Player) {
    this.gameObject = targetObject;
    this.cursors = this.gameObject.scene.input.keyboard.createCursorKeys();
  }

  public awake() {
    MainScene.grid.addCharacter({
      id: 'player',
      sprite: this.gameObject,
      // walkingAnimationMapping: 6,
      startPosition: {
        x: PLAYER_START_POS_X,
        y: PLAYER_START_POS_Y,
      },
      speed: this.speed,
      // charLayer: 'ground',
    });
  }

  public start() {
    this.onSocketEmitCreateEvent();
    this.onSocketReceiveCreateEvent();
    this.onSocketPositionUpdate();
    this.onSocketReceivePrivateMessage();
    this.onSocketReceiveLogout();
  }

  public update() {
    if (this.canMove) {
      if (this.cursors.up.isDown && !this.gridEngine.isMoving('player')) {
        this.gridEngine.move('player', 'up');
        this.direction = 'up';
      } else if (this.cursors.down.isDown && !this.gridEngine.isMoving('player')) {
        this.direction = 'down';
        this.gridEngine.move('player', 'down');
      } else if (this.cursors.left.isDown && !this.gridEngine.isMoving('player')) {
        this.direction = 'left';
        this.gridEngine.move('player', 'left');
      } else if (this.cursors.right.isDown && !this.gridEngine.isMoving('player')) {
        this.direction = 'right';
        this.gridEngine.move('player', 'right');
      }
    }
    this.gameObject.playAnimations(this.direction, MainScene.grid.isMoving('player'));
  }

  private onSocketPositionUpdate() {
    MainScene.grid.movementStarted().subscribe(({ charId, direction }) => {
      if (charId === 'player') {
        this.canMove = false;

        geckosClientHelper.channel.emit(PlayerGeckosEvents.PlayerPositionUpdate, {
          id: Player.id,
          x: this.gameObject.x,
          y: this.gameObject.y,
          direction,
          name: this.gameObject.name,
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

    // if received position update event, but other player wasn't created yet, create it
    geckosClientHelper.channel.on(PlayerGeckosEvents.PlayerPositionUpdate, (d) => {
      const data = d as IConnectedPlayer;

      const foundPlayer = MainScene.otherPlayers.find((p) => p.id === data.id);

      if (!foundPlayer) {
        const otherPlayer = new OtherPlayer(
          this.gameObject.scene as MainScene,
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
  }

  private onSocketEmitCreateEvent() {
    geckosClientHelper.channel.emit(
      PlayerGeckosEvents.PlayerCreate,
      {
        id: Player.id,
        name: this.gameObject.name,
        channelId: geckosClientHelper.channelId,
        x: this.gameObject.x,
        y: this.gameObject.y,
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
  }

  private onSocketReceiveCreateEvent() {
    // when receiving a new player creation event, lets create his instance

    geckosClientHelper.channel.on(PlayerGeckosEvents.PlayerCreate, (d) => {
      const data = d as IConnectedPlayer;

      const otherPlayer = new OtherPlayer(
        this.gameObject.scene as MainScene,
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
  }

  private onSocketReceivePrivateMessage() {
    geckosClientHelper.channel.on(PlayerGeckosEvents.PlayerPrivateMessage, (data) => {
      console.log(data);
    });
  }

  private onSocketReceiveLogout() {
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
