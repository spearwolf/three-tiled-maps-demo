import { TiledMap } from './tiledmap/TiledMap';

export default async function(url: string): Promise<object> {
  const jsonData = await fetch(url).then((response) => response.json());
  return new TiledMap(jsonData);
}
