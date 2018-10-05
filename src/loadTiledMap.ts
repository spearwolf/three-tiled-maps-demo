import { MapTile } from './tiledmap/MapTile';
import { TiledMap } from './tiledmap/TiledMap';

export default async function(url: string): Promise<object> {
  const tiledMapData = await fetch(url).then((response) => response.json());
  console.log('tiledMapData', tiledMapData);
  const tiledMap = new TiledMap(tiledMapData);
  console.log('tiledMap', tiledMap);
  console.log('(-1,0)->(4,6)', tiledMap.layers.get('main').getTileIdsAt(-1, 0, 4, 6));

  const tile = new MapTile(tiledMap.layers.get('main'), 2, 2).setPosition(10, 0).fetchTileIds();
  console.log('(10,0)->(2,2)', tile);

  return tiledMap;
}
