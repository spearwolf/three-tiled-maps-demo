import { Map2DLayerTile } from './Map2DLayerTile';

export interface IMap2DLayerRenderer {

  addLayerTile(tile: Map2DLayerTile): void;
  updateLayerTile(tile: Map2DLayerTile): void;
  removeLayerTile(tileId: string): void;

}
