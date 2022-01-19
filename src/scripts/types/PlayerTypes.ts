export enum PlayerGeckosEvents {
  Create = 'Create',
  PositionUpdate = 'PositionUpdate',
  Logout = 'Logout',
  PrivateMessage = 'PrivateMessage',
}

export interface PlayerCreationPayload {
  id: string;
  name: string;
  channelId: string;
  x: number;
  y: number;
}

export interface PlayerPositionPayload {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: string;
}

export interface PlayerLogoutPayload {
  id: string;
}
