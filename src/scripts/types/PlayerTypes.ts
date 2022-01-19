export enum PlayerGeckosEvents {
  Create = 'Create',
  PositionUpdate = 'PositionUpdate',
  CoordinateSync = 'CoordinateSync',
  Logout = 'Logout',
  PrivateMessage = 'PrivateMessage',
}

export interface PlayerCoordinatesSync {
  id: string;
  x: number;
  y: number;
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
