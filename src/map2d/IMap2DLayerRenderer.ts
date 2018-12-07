import { Map2DViewTile } from './Map2DViewTile';

export interface IMap2DLayerRenderer {

  addViewTile(tile: Map2DViewTile): void;
  updateViewTile(tile: Map2DViewTile): void;
  removeViewTile(tileId: string): void;

}
