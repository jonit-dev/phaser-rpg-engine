export enum PlayerGeckosEvents {
  Create = 'Create',
  PositionUpdate = 'PositionUpdate',
  CoordinateSync = 'CoordinateSync',
  Logout = 'Logout',
  PrivateMessage = 'PrivateMessage',
}

export interface PlayerPositionPayload {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: string;
  channelId: string;
  isMoving?: boolean;
}

export interface PlayerLogoutPayload {
  id: string;
}
