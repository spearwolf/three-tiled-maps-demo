import * as THREE from 'three';

import { Map2DLayerTile } from '../Map2DLayerTile';
import { LayerTileBufferGeometry } from './LayerTileBufferGeometry';
import { TextureLibrary } from './TextureLibrary';

export class LayerTile {
  readonly mesh: THREE.Mesh;

  constructor(
    readonly map2dLayerTile: Map2DLayerTile,
    readonly textureLibrary: TextureLibrary = null,
  ) {

    map2dLayerTile.fetchTileIds();

    const geometry = new LayerTileBufferGeometry(this);

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
