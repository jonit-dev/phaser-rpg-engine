import { appEnv } from '../constants/appEnv';
import { TILE_HEIGHT, TILE_WIDTH } from '../constants/worldConstants';
import { IMap } from '../typings/MapsTypes';

export const maps: IMap[] = [
  {
    JSONKey: 'default_map',
    imageKey: 'default_map_tileset',
    layers: ['ground', 'over-ground', 'player', 'over-player'],
    tileWidth: TILE_WIDTH,
    tileHeight: TILE_HEIGHT,
    imagePath: 'assets/tilesets/forest/forest.png',
    jsonPath: `${appEnv.server.url}/maps/another_map.json`,
    tilesetName: 'forest', //specific in tiled data
  },
];
