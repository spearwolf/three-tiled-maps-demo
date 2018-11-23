import * as THREE from 'three';

import { Map2DGridTile } from '../Map2DGridTile';
import { GridTileBufferGeometry } from './GridTileBufferGeometry';
import { TextureBakery } from './TextureBakery';

export class GridTile {
  mesh: THREE.Mesh;
  readonly textureBakery: TextureBakery;
  gridTileGeometry: GridTileBufferGeometry;

  constructor(tile: Map2DGridTile) {
    this.textureBakery = new TextureBakery(256, 256);
    this.textureBakery.make(tile.id);

    const { viewWidth, viewHeight } = tile;
    this.gridTileGeometry = new GridTileBufferGeometry(viewWidth, viewHeight, tile.width, tile.height, tile.viewOffsetX, tile.viewOffsetY);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: this.textureBakery.texture,
    });

    this.mesh = new THREE.Mesh(this.gridTileGeometry, material);
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
