import { IComponent } from '../../../../abstractions/ComponentService';
import { PLAYER_START_POS_X, PLAYER_START_POS_Y } from '../../../../constants/playerConstants';
import { GRID_HEIGHT, GRID_WIDTH } from '../../../../constants/worldConstants';
import { geckosClientHelper } from '../../../../game';
import MainScene from '../../../../scenes/mainScene';
import { AnimationDirection } from '../../../../typings/AnimationTypes';
import { IConnectedPlayer, PlayerGeckosEvents, PlayerLogoutPayload } from '../../../../typings/PlayerTypes';
import { OtherPlayer } from '../../OtherPlayer';
import { Player } from '../../Player';
import { PlayerCamera } from './PlayerCamera';

export class PlayerMovement implements IComponent {
  private gameObject: Player;
  private cursors;
  private gridEngine = MainScene.grid;
  private speed = 4; //tiles per second
  private direction: AnimationDirection = 'down';
  private canMove = true;
  private movementIntervalSpeed = 25; //in ms
  private camera: Phaser.Cameras.Scene2D.Camera;

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
      charLayer: 'player',
    });
  }

  public start() {
    this.camera = this.gameObject.scene.cameras.main;

    this.onSocketEmitCreateEvent();
    this.onSocketReceiveCreateEvent();
    this.onSocketPositionUpdate();
    this.onSocketReceivePrivateMessage();
    this.onSocketReceiveLogout();
  }

  public update() {
    // update center point (useful for collision detection) - its located around the character foot

    if (this.canMove) {
      const nextMovements = {
        down: { x: Math.round(this.gameObject.x), y: Math.round(this.gameObject.y) + GRID_HEIGHT },
        up: { x: Math.round(this.gameObject.x), y: Math.round(this.gameObject.y) - GRID_HEIGHT },
        left: { x: Math.round(this.gameObject.x) - GRID_WIDTH, y: Math.round(this.gameObject.y) },
        right: { x: Math.round(this.gameObject.x) + GRID_WIDTH, y: Math.round(this.gameObject.y) },
      };

      if (this.cursors.up.isDown && !this.gridEngine.isMoving('player')) {
        this.direction = 'up';
        if (!this.hasBlockingTile(nextMovements[this.direction].x, nextMovements[this.direction].y)) {
          this.gridEngine.move('player', 'up');
        }
      } else if (this.cursors.down.isDown && !this.gridEngine.isMoving('player')) {
        this.direction = 'down';
        if (!this.hasBlockingTile(nextMovements[this.direction].x, nextMovements[this.direction].y)) {
          this.gridEngine.move('player', 'down');
        }
      } else if (this.cursors.left.isDown && !this.gridEngine.isMoving('player')) {
        this.direction = 'left';
        if (!this.hasBlockingTile(nextMovements[this.direction].x, nextMovements[this.direction].y)) {
          this.gridEngine.move('player', 'left');
        }
      } else if (this.cursors.right.isDown && !this.gridEngine.isMoving('player')) {
        this.direction = 'right';
        if (!this.hasBlockingTile(nextMovements[this.direction].x, nextMovements[this.direction].y)) {
          this.gridEngine.move('player', 'right');
        }
      }
    }
    this.gameObject.playAnimations(this.direction, MainScene.grid.isMoving('player'));
  }

  private hasBlockingTile(x: number, y: number) {
    const hasBlockingTile = this.gameObject.tilemap.layers.some((layer) => {
      const tile = this.gameObject.tilemap.getTileAtWorldXY(x, y, false, this.camera, layer.name);

      return tile && tile.properties.ge_collide;
    });

    if (hasBlockingTile) {
      this.submitPlayerPositionUpdate(this.direction, false); // if we have a blocking tile, update online our player direction (not the movement)
    }

    return hasBlockingTile;
  }

  private onSocketPositionUpdate() {
    MainScene.grid.movementStarted().subscribe(({ charId, direction }) => {
      if (charId === 'player') {
        this.canMove = false;

        this.submitPlayerPositionUpdate(direction, true);
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

      const foundPlayer = MainScene.otherPlayersInView.find((p) => p.id === data.id);

      if (!foundPlayer) {
        const otherPlayer = new OtherPlayer(
          this.gameObject.scene as MainScene,
          data.id,
          data.name,
          data.x,
          data.y,
          data.direction as AnimationDirection,
          data.cameraCoordinates,
          'player',
          data.channelId,
          data.isMoving!
        );
      }
    });
  }

  private submitPlayerPositionUpdate(direction: AnimationDirection, isMoving: boolean) {
    geckosClientHelper.channel.emit(PlayerGeckosEvents.PlayerPositionUpdate, {
      id: Player.id,
      x: Math.round(this.gameObject.x),
      y: Math.round(this.gameObject.y),
      direction,
      name: this.gameObject.name,
      channelId: geckosClientHelper.channelId,
      isMoving,
      cameraCoordinates: {
        x: PlayerCamera.worldViewWithOffset.x,
        y: PlayerCamera.worldViewWithOffset.y,
        width: PlayerCamera.worldViewWithOffset.width,
        height: PlayerCamera.worldViewWithOffset.height,
      },
      otherPlayersInView: MainScene.otherPlayersInView,
    } as IConnectedPlayer);
  }

  private onSocketEmitCreateEvent() {
    setTimeout(() => {
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
            x: PlayerCamera.worldViewWithOffset.x,
            y: PlayerCamera.worldViewWithOffset.y,
            width: PlayerCamera.worldViewWithOffset.width,
            height: PlayerCamera.worldViewWithOffset.height,
          },
        } as IConnectedPlayer,
        {
          reliable: true,
        }
      );
    }, 100);
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
        'player',
        data.channelId,
        data.isMoving!
      );
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
