import * as THREE from 'three';

import { Map2DGridTile } from '../Map2DGridTile';
import { GridTileBufferGeometry } from './GridTileBufferGeometry';
import { TextureBakery } from './TextureBakery';
import { TextureLibrary } from './TextureLibrary';

export class GridTile {
  mesh: THREE.Mesh;
  readonly textureBakery: TextureBakery;
  gridTileGeometry: GridTileBufferGeometry;

  constructor(tile: Map2DGridTile, public textureLibrary: TextureLibrary = null) {
    if (textureLibrary == null) {
      this.textureBakery = new TextureBakery(256, 256);
      this.textureBakery.make(tile.id);
    }

    this.gridTileGeometry = new GridTileBufferGeometry(tile);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: (textureLibrary != null ? textureLibrary.baseTexture : this.textureBakery.texture),
    });

    this.mesh = new THREE.Mesh(this.gridTileGeometry, material);
  }

  appendTo(obj: THREE.Object3D) {
    obj.add(this.mesh);
  }

  removeFrom(obj: THREE.Object3D) {
    obj.remove(this.mesh);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.textureBakery.dispose();
  }
}
