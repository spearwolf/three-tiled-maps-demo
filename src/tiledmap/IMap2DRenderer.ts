import { Map2DGridTile } from './Map2DGridTile';

export interface IMap2DRenderer {
  addGridTile(tile: Map2DGridTile): void;
  removeGridTile(tileId: string): void;
  updateGridTile(tile: Map2DGridTile): void;
}
