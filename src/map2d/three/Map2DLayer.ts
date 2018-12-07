import * as THREE from 'three';

import { IMap2DLayerRenderer } from '../IMap2DLayerRenderer';
import { Map2DViewTile } from '../Map2DViewTile';
import { TextureLibrary } from '../TextureLibrary';

import { Map2DLayerTile } from './Map2DLayerTile';

export class Map2DLayer implements IMap2DLayerRenderer {

  readonly obj3d: THREE.Object3D = new THREE.Object3D();

  private readonly material: THREE.Material;
  private readonly texture: THREE.Texture;

  private readonly tiles: Map<string, Map2DLayerTile> = new Map();

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
    this.texture.dispose();
    this.material.dispose();
  }

  addViewTile(tile: Map2DViewTile) {
    this.createTile(tile).appendTo(this.obj3d);
  }

  removeViewTile(tileId: string) {
    const gt = this.destroyTile(tileId);
    if (gt !== null) {
      gt.removeFrom(this.obj3d);
      gt.dispose();
    }
 }

  renderViewTile(_tile: Map2DViewTile) {
    // console.log('[Map2DSceneTHREE] update grid-tile:', tile.id);
  }

  private destroyTile(id: string): Map2DLayerTile {
    if (this.tiles.has(id)) {
      const gt = this.tiles.get(id);
      this.tiles.delete(id);
      return gt;
    }
    return null;
  }

  private createTile(viewTile: Map2DViewTile): Map2DLayerTile {
    const gt = new Map2DLayerTile(viewTile, this.material, this.textureLibrary);
    this.tiles.set(viewTile.id, gt);
    return gt;
  }
}
