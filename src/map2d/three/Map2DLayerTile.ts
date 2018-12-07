import * as THREE from 'three';

import { Map2DViewTile } from '../Map2DViewTile';

import { Map2DLayerTileBufferGeometry } from './Map2DLayerTileBufferGeometry';
import { TextureLibrary } from './TextureLibrary';

export class Map2DLayerTile {
  readonly mesh: THREE.Mesh;

  constructor(
    readonly viewTile: Map2DViewTile,
    readonly textureLibrary: TextureLibrary = null,
  ) {

    viewTile.fetchTileIds();

    const geometry = new Map2DLayerTileBufferGeometry(this);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
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
  }
}
