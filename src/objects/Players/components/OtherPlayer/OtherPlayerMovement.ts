import { IComponent } from '../../../../abstractions/ComponentService';
import { GRID_HEIGHT, GRID_WIDTH } from '../../../../constants/worldConstants';
import { geckosClientHelper } from '../../../../game';
import MainScene from '../../../../scenes/mainScene';
import { AnimationDirection } from '../../../../typings/AnimationTypes';
import { IConnectedPlayer, PlayerGeckosEvents } from '../../../../typings/PlayerTypes';
import { OtherPlayer } from '../../OtherPlayer';
import { PlayerCamera } from '../Player/PlayerCamera';

export class OtherPlayerMovement implements IComponent {
  private gameObject: OtherPlayer;
  private direction: AnimationDirection = 'down';
  private speed: number = 4;

  constructor(direction: AnimationDirection) {
    this.direction = direction;
  }

  public init(targetObject: OtherPlayer) {
    this.gameObject = targetObject;
  }

  public awake() {
    MainScene.grid.addCharacter({
      id: this.gameObject.id,
      sprite: this.gameObject,
      startPosition: {
        x: Math.round(this.gameObject.x / GRID_WIDTH),
        y: Math.round(this.gameObject.y / GRID_HEIGHT),
      },
      speed: this.speed,
    });
  }

  public start() {
    this.onSocketReceivePositionUpdate();
  }

  public update() {
    if (MainScene.grid.hasCharacter(this.gameObject.id) && this.gameObject.active) {
      this.gameObject.playAnimations(this.direction, MainScene.grid.isMoving(this.gameObject.id));

      // delete itself if too far, to preserve memory
      const isOnView = PlayerCamera.worldViewWithOffset.contains(this.gameObject.x, this.gameObject.y);

      if (!isOnView) {
        console.log(`destroying other player out of view: ${this.gameObject.id}`);
        this.gameObject.destroy();
      }
    }
  }

  public onSocketReceivePositionUpdate() {
    geckosClientHelper.channel.on(PlayerGeckosEvents.PlayerPositionUpdate, (d) => {
      const data = d as IConnectedPlayer;

      if (data.id === this.gameObject.id) {
        console.log(`received position update for other player ${data.id}`);
        console.log('pos', data);

        this.gameObject.x = data.x;
        this.gameObject.y = data.y;

        // this.cameraCoordinates = data.cameraCoordinates; //! REACTIVATE on debug

        MainScene.grid.setPosition(this.gameObject.id, {
          x: Math.round(data.x / GRID_WIDTH),
          y: Math.round(data.y / GRID_HEIGHT),
        });

        this.direction = data.direction as AnimationDirection;

        if (data.isMoving) {
          MainScene.grid.move(this.gameObject.id, data.direction);
        }

        // update our view representation
        MainScene.otherPlayersInView = MainScene.otherPlayersInView.map((player) => {
          if (player.id === data.id) {
            return {
              ...data,
            };
          }

          return player;
        });
      }
    });
  }
}
