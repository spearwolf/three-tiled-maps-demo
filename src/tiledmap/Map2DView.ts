import * as THREE from 'three';

import { Map2DLayerGrid } from './Map2DLayerGrid';
import { TiledMap } from './TiledMap';

export class Map2DView {
  readonly tiledMap: TiledMap;
  readonly scene: THREE.Scene;

  readonly origin: THREE.Vector2;
  readonly dimension: THREE.Vector2;

  readonly layers: Map2DLayerGrid[] = [];

  /**
   * Represents a 2D view into a tiled map along the x- and y- axis.
   * The unit of measurement are pixels unless otherwise stated.
   *
   * @param width width
   * @param height height
   * @param originX horizontal center position
   * @param originY vertical center position
   */
  constructor(tiledMap: TiledMap, width: number, height: number, originX: number, originY: number) {
    this.tiledMap = tiledMap;
    this.dimension = new THREE.Vector2(width, height);
    this.origin = new THREE.Vector2(originX, originY);

    this.scene = new THREE.Scene();

    for (const layer of tiledMap.layers.values()) {
      this.layers.push(new Map2DLayerGrid(this, layer));
    }
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
