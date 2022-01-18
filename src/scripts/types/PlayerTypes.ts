export enum PlayerGeckosEvents {
  Create = 'Create',
  PositionUpdate = 'PositionUpdate',
  Logout = 'Logout',
  PrivateMessage = 'PrivateMessage',
}

export interface PlayerCreationPayload {
  id: string;
  channelId: string;
  x: number;
  y: number;
}

export interface PlayerLogoutPayload {
  id: string;
}
