import * as THREE from 'three';

import { Map2DGridTile } from '../Map2DGridTile';
import { TextureBakery } from './TextureBakery';

export class GridTileTHREE {
  mesh: THREE.Mesh;
  readonly textureBakery: TextureBakery;

  constructor(tile: Map2DGridTile) {
    this.textureBakery = new TextureBakery(256, 256);
    this.textureBakery.make(tile.id);

    const { viewWidth, viewHeight } = tile;
    const geometry = new THREE.PlaneBufferGeometry(viewWidth, viewHeight);
    geometry.translate(tile.viewOffsetX + (viewWidth / 2), tile.viewOffsetY + (viewHeight / 2), 0);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: this.textureBakery.texture,
    });

    this.mesh = new THREE.Mesh(geometry, material);
  }

  appendTo(scene: THREE.Scene) {
    scene.add(this.mesh);
  }

  removeFrom(scene: THREE.Scene) {
    scene.remove(this.mesh);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.textureBakery.dispose();
  }
}
