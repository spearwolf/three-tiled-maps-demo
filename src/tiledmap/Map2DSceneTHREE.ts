import * as THREE from 'three';

import { IMap2DRenderer } from './IMap2DRenderer';
import { Map2DGridTile } from './Map2DGridTile';

export class Map2DSceneTHREE implements IMap2DRenderer {
  readonly scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
  }

  appendTo(scene: THREE.Scene) {
    if (!scene.children.includes(this.scene)) {
      scene.add(this.scene);
    }
  }

  removeFrom(scene: THREE.Scene) {
    scene.remove(this.scene);
  }

  addGridTile(tile: Map2DGridTile) {
    console.log('[Map2DSceneTHREE] add grid-tile:', tile.id);
  }

  removeGridTile(tileId: string) {
    console.log('[Map2DSceneTHREE] remove grid-tile:', tileId);
  }

  updateGridTile(_tile: Map2DGridTile) {
    // console.log('[Map2DSceneTHREE] update grid-tile:', tile.id);
  }
}
