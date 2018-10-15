import * as THREE from 'three';

import { Map2DLayerGrid } from './Map2DLayerGrid';
import { TiledMap } from './TiledMap';

export class Map2DView {
  public readonly tiledMap: TiledMap;
  public readonly scene: THREE.Scene;

  public readonly origin: THREE.Vector2;
  public readonly dimension: THREE.Vector2;

  public readonly layers: Map2DLayerGrid[] = [];

  /**
   * Represents a 2d view into a tiled map along the x- and y- axis.
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

  public setOrigin(originX: number, originY: number) {
    this.origin.set(originX, originY);
  }

  public setDimension(width: number, height: number) {
    this.dimension.set(width, height);
  }

  public appendTo(scene: THREE.Scene) {
    if (!scene.children.includes(this.scene)) {
      scene.add(this.scene);
    }
  }

  public removeFrom(scene: THREE.Scene) {
    scene.remove(this.scene);
  }

  public update() {
    this.layers.forEach((layer) => layer.update());
  }
}
