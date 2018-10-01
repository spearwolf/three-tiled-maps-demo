import { TiledMap } from './tiledmap/TiledMap';

export default async function(url: string): Promise<object> {
  const tiledMapData = await fetch(url).then((response) => response.json());
  console.log('tiledMapData', tiledMapData);
  const tiledMap = new TiledMap(tiledMapData);
  console.log('tiledMap', tiledMap);
  console.log('(-1,0)->(4,6)', tiledMap.layers.get('main').getTileIdsAt(-1, 0, 4, 6));
  console.log('(10,0)->(2,2)', tiledMap.layers.get('main').getTileIdsAt(10, 0, 2, 2));
  return tiledMap;
}
