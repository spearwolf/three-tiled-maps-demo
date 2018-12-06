import { Map2DLayerTile } from './Map2DLayerTile';
import { Map2DView } from './Map2DView';

export interface IMap2DRenderer {

  addLayerTile(tile: Map2DLayerTile): void;
  removeLayerTile(tileId: string): void;
  updateLayerTile(tile: Map2DLayerTile): void;

  postRender(view: Map2DView): void;

}
