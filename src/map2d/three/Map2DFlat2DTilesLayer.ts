import * as THREE from 'three';

import { IMap2DLayerRenderer } from '../IMap2DLayerRenderer';
import { Map2DViewTile } from '../Map2DViewTile';
import { TextureLibrary } from '../TextureLibrary';

import { Map2DTileBufferGeometry } from './Map2DTileBufferGeometry';

export class Map2DFlat2DTilesLayer implements IMap2DLayerRenderer {

  readonly obj3d: THREE.Object3D = new THREE.Object3D();

  private readonly material: THREE.Material;
  private readonly texture: THREE.Texture;

  private readonly tiles: Map<string, THREE.Mesh> = new Map();

  constructor(readonly textureLibrary: TextureLibrary) {

    this.texture = new THREE.Texture(textureLibrary.atlas.baseTexture.imgEl);
    this.texture.flipY = false;
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.needsUpdate = true;

    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: this.texture,
      transparent: true,
    });

  }

  dispose() {
    Array.from(this.tiles.values()).forEach((tile) => {
      tile.geometry.dispose();
    });
    this.tiles.clear();

    this.texture.dispose();
    this.material.dispose();
  }

  addViewTile(tile: Map2DViewTile) {
    const mesh = this.createTileMesh(tile);
    mesh.name = tile.id;
    this.obj3d.add(mesh);
  }

  removeViewTile(tileId: string) {
    const mesh = this.destroyTile(tileId);
    if (mesh !== null) {
      this.obj3d.remove(mesh);
      mesh.geometry.dispose();
    }
 }

  renderViewTile(_tile: Map2DViewTile) {
    // console.log('[Map2DSceneTHREE] update grid-tile:', tile.id);
  }

  private destroyTile(id: string): THREE.Mesh {
    if (this.tiles.has(id)) {
      const mesh = this.tiles.get(id);
      this.tiles.delete(id);
      return mesh;
    }
    return null;
  }

  private createTileMesh(viewTile: Map2DViewTile): THREE.Mesh {
    const geometry = new Map2DTileBufferGeometry(viewTile, this.textureLibrary);
    const mesh = new THREE.Mesh(geometry, this.material);
    this.tiles.set(viewTile.id, mesh);
    return mesh;
  }
}
