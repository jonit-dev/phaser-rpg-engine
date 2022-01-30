import { IComponent } from '../../../../abstractions/ComponentService';
import { geckosClientHelper } from '../../../../game';
import { gridHelper } from '../../../../libs/GridHelper';
import MainScene from '../../../../scenes/mainScene';
import { AnimationDirection } from '../../../../typings/AnimationTypes';
import { MapLayers } from '../../../../typings/MapsTypes';
import { IConnectedPlayer, PlayerGeckosEvents } from '../../../../typings/PlayerTypes';
import { OtherPlayer } from '../../OtherPlayer';
import { PlayerCamera } from '../Player/PlayerCamera';

export class OtherPlayerMovement implements IComponent {
  private gameObject: OtherPlayer;
  private direction: AnimationDirection = 'down';

  constructor(direction: AnimationDirection) {
    this.direction = direction;
  }

  public init(targetObject: OtherPlayer) {
    this.gameObject = targetObject;
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
      this.gameObject.setDepth(MapLayers.Player);
    }
  }

  public onSocketReceivePositionUpdate() {
    geckosClientHelper.channel.on(PlayerGeckosEvents.PlayerPositionUpdate, (d) => {
      const data = d as IConnectedPlayer;

      if (data.id === this.gameObject.id) {
        console.log(`received position update for other player ${data.id}`);
        console.log('pos', data);

        const { gridX, gridY } = gridHelper.convertToGridXY(data.x, data.y);

        MainScene.grid.setPosition(this.gameObject.id, {
          x: gridX,
          y: gridY,
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
