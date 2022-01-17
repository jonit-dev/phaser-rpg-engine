const columns = 20;
const tileCount = 740;
const tileWidth = 32;
const tileHeight = 32;

// create a function to get tile x and y based on tile ID
const getTileXY = (tileId: number) => {
  const column = tileId % columns;
  const row = Math.floor(tileId / columns);
  return {
    x: column * tileWidth,
    y: row * tileHeight,
  };
};
console.log(getTileXY(1));
