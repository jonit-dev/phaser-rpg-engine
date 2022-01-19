import geckos, { ChannelId, ClientChannel } from '@geckos.io/client';
import { Player } from '../../objects/Players/Player';
import { PlayerGeckosEvents } from '../../types/PlayerTypes';

export class GeckosClientHelper {
  public channel: ClientChannel;
  public channelId: ChannelId;

  constructor() {
    this.channel = geckos({ port: 3000 }); // default port is 9208
  }

  public async init() {
    return new Promise((resolve, reject) => {
      this.channel.onConnect((error) => {
        console.log('⚙️ GeckosClient: connected to server');

        this.channelId = this.channel.id;

        if (error) {
          reject(error.message);
        }
        resolve(true);
      });
      this.channel.onDisconnect((error) => {
        console.log('⚙️ GeckosClient: disconnected from server');
        alert('You got disconnected from the server. Please check your connection.');
        if (error) {
          console.log('Failed to disconnect from server: ', error.message);
        }
      });
    });
  }

  public disconnect() {
    this.channel.emit(PlayerGeckosEvents.Logout, {
      id: Player.id,
    } as unknown as PlayerGeckosEvents.Logout);

    setTimeout(() => {
      this.channel.close();
    }, 1000);
  }
}
