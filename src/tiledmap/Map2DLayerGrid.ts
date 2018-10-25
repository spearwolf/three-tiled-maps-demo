import * as THREE from 'three';

import { Map2DView } from './Map2DView';
import { TiledMapLayer } from './TiledMapLayer';

export class Map2DLayerGrid {
  readonly view: Map2DView;
  readonly layer: TiledMapLayer;

  constructor(view: Map2DView, layer: TiledMapLayer) {
    this.view = view;
    this.layer = layer;
  }

  update() {
    // I. create visible map tiles (and remove/dispose unvisible)
    //
    const { tilewidth, tileheight } = this.view.tiledMap;
    const tileSize = new THREE.Vector2(tilewidth, tileheight);

    const halfDimension = this.view.dimension.clone();
    halfDimension.multiplyScalar(0.5);

    const topLeft = this.view.origin.clone();
    topLeft.sub(halfDimension);
    topLeft.divide(tileSize);
    topLeft.set(Math.floor(topLeft.x), Math.floor(topLeft.y));

    const bottomRight = this.view.origin.clone();
    bottomRight.add(halfDimension);
    bottomRight.divide(tileSize);
    bottomRight.set(Math.floor(bottomRight.x), Math.floor(bottomRight.y));

    const sizes = bottomRight.clone();
    sizes.sub(topLeft);

    console.log('topLeft', topLeft.x, topLeft.y, 'bottomRight', bottomRight.x, bottomRight.y, 'sizes', sizes.x, sizes.y);

    // II. create geometries for all *new* map tiles
  }
}
