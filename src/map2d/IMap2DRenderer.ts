import { Map2DGridTile } from './Map2DGridTile';
import { Map2DView } from './Map2DView';

export interface IMap2DRenderer {
  addGridTile(tile: Map2DGridTile): void;
  removeGridTile(tileId: string): void;
  updateGridTile(tile: Map2DGridTile): void;

  postRender(view: Map2DView): void;
}
