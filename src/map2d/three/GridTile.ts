import * as THREE from 'three';

import { Map2DGridTile } from '../Map2DGridTile';
import { GridTileBufferGeometry } from './GridTileBufferGeometry';
// import { TextureBakery } from './TextureBakery';
import { TextureLibrary } from './TextureLibrary';

export class GridTile {
  readonly mesh: THREE.Mesh;
  // readonly textureBakery: TextureBakery;

  constructor(readonly map2dGridTile: Map2DGridTile, readonly textureLibrary: TextureLibrary = null) {
    // this.textureBakery = new TextureBakery(256, 256);
    // this.textureBakery.make(tile.id);

    map2dGridTile.fetchTileIds();

    const geometry = new GridTileBufferGeometry(this);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      // map: this.textureBakery.texture,
      map: textureLibrary.baseTexture,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(geometry, material);
  }

  appendTo(obj: THREE.Object3D) {
    obj.add(this.mesh);
  }

  removeFrom(obj: THREE.Object3D) {
    obj.remove(this.mesh);
  }

  dispose() {
    this.mesh.geometry.dispose();
    // this.textureBakery.dispose();
  }
}
