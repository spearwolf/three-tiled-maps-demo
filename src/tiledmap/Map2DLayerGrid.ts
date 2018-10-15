import { Map2DView } from './Map2DView';
import { TiledMapLayer } from './TiledMapLayer';

export class Map2DLayerGrid {
  public readonly view: Map2DView;
  public readonly layer: TiledMapLayer;

  constructor(view: Map2DView, layer: TiledMapLayer) {
    this.view = view;
    this.layer = layer;
    console.log('Map2DLayerGrid: calc grid tile sizes', this);
  }

  public update() {
    // I. create visible map tiles (and remove/dispose unvisible)
    // II. create geometries for all *new* map tiles
  }
}
