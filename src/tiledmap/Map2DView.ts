import * as THREE from 'three';

import { IMap2DLayer } from './IMap2DLayer';
import { Map2DLayerGrid } from './Map2DLayerGrid';

/**
 * Represents a 2d section in a 2d map along the x- and y- axis.
 * A 2d map is defined by one or more layers.
 *
 * The unit of measurement are *pixels* unless otherwise stated.
 */
export class Map2DView {
  readonly scene: THREE.Scene;

  readonly origin: THREE.Vector2;
  readonly dimension: THREE.Vector2;

  readonly layers: Map2DLayerGrid[] = [];

  /**
   * @param width width
   * @param height height
   * @param originX horizontal center position
   * @param originY vertical center position
   */
  constructor(width: number, height: number, originX: number, originY: number, layers?: IMap2DLayer[]) {
    this.dimension = new THREE.Vector2(width, height);
    this.origin = new THREE.Vector2(originX, originY);
    this.scene = new THREE.Scene();
    if (layers) {
      layers.forEach((layer: IMap2DLayer) => this.appendLayer(new Map2DLayerGrid(this, layer)));
    }
  }

  appendLayer(layer: Map2DLayerGrid) {
    this.layers.push(layer);
  }

  setOrigin(originX: number, originY: number) {
    this.origin.set(originX, originY);
  }

  setDimension(width: number, height: number) {
    this.dimension.set(width, height);
  }

  appendTo(scene: THREE.Scene) {
    if (!scene.children.includes(this.scene)) {
      scene.add(this.scene);
    }
  }

  removeFrom(scene: THREE.Scene) {
    scene.remove(this.scene);
  }

  update() {
    this.layers.forEach((layer) => layer.update());
  }
}
