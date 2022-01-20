export const WORLD_WIDTH = 3200;
export const WORLD_HEIGHT = 3200;

export const CAMERA_VIEWPORT_WIDTH = 812;
export const CAMERA_VIEWPORT_HEIGHT = 375;

export const GRID_WIDTH = 32;
export const GRID_HEIGHT = 32;

// we have a multiplier because just adding a grid width/height is not enough for a good offset. Numbers < 10 can cause issues

export const CAMERA_VIEWPORT_OFFSET_X = GRID_WIDTH * 2;
export const CAMERA_VIEWPORT_OFFSET_Y = GRID_HEIGHT * 2;
