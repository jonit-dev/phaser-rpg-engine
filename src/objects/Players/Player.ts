import { animals, uniqueNamesGenerator } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import { ComponentsScene } from '../../abstractions/CustomScene';
import { Entity } from '../../abstractions/Entity';
import { PLAYER_START_POS_X, PLAYER_START_POS_Y } from '../../constants/playerConstants';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { geckosClientHelper } from '../../game';
import MainScene from '../../scenes/mainScene';
import { AnimationDirection } from '../../typings/AnimationTypes';
import { IConnectedPlayer, PlayerGeckosEvents, PlayerLogoutPayload } from '../../typings/PlayerTypes';
import { PlayerMovement } from './components/PlayerMovement';
import { PlayerUI } from './components/PlayerUI';
import { OtherPlayer } from './OtherPlayer';

export class Player extends Entity {
  public static id = uuidv4();
  public static speed = 2; //tiles per second
  public direction: AnimationDirection = 'down';
  public name: string;
  public canMove = true;
  private movementIntervalSpeed = 25; //in ms

  constructor(scene: ComponentsScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, MainSceneData.assets);

    scene.components.addComponent(this, new PlayerUI());
    scene.components.addComponent(this, new PlayerMovement());

    this.name = uniqueNamesGenerator({
      dictionaries: [animals],
      length: 1,
    });

    console.log(`Player id ${Player.id} has been created`);

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

    MainScene.camera.startFollow(this);
    MainScene.camera.roundPixels = true; //! This MUST be after startFollow method, otherwise it won't work

    MainScene.camera.centerOn(this.x, this.y);
    MainScene.camera.followOffset.set(MainScene.camera.worldView.width / 2, MainScene.camera.worldView.height / 2);
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
