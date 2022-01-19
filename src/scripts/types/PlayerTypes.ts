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
  cameraCoordinates: ICameraCoordinates;
}

export interface ICameraCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlayerLogoutPayload {
  id: string;
}
