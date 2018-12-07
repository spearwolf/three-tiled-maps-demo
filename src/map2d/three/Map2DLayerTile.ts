import * as THREE from 'three';

import { Map2DViewTile } from '../Map2DViewTile';
import { TextureLibrary } from '../TextureLibrary';

import { Map2DLayerTileBufferGeometry } from './Map2DLayerTileBufferGeometry';

export class Map2DLayerTile {
  readonly mesh: THREE.Mesh;

  constructor(
    readonly viewTile: Map2DViewTile,
    readonly material: THREE.Material,
    readonly textureLibrary: TextureLibrary,
  ) {

    viewTile.fetchTileIds();

    const geometry = new Map2DLayerTileBufferGeometry(this, textureLibrary);

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
