import { GRID_HEIGHT, GRID_WIDTH } from '../constants/worldConstants';

interface IGridPos {
  gridX: number;
  gridY: number;
}

interface IPos {
  x: number;
  y: number;
}
class GridHelper {
  public convertToGridXY(x: number, y: number): IGridPos {
    return {
      gridX: Math.round(Math.round(x / GRID_WIDTH)),
      gridY: Math.round(Math.round(y / GRID_HEIGHT)),
    };
  }

  public convertToXY(gridX: number, gridY: number): IPos {
    return {
      x: Math.round(gridX * GRID_WIDTH),
      y: Math.round(gridY * GRID_HEIGHT),
    };
  }
}

export const gridHelper = new GridHelper();
