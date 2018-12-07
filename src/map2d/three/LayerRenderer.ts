import * as THREE from 'three';

import { IMap2DLayerRenderer } from '../IMap2DLayerRenderer';
import { Map2DLayerTile } from '../Map2DLayerTile';

import { LayerTile } from './LayerTile';
import { TextureLibrary } from './TextureLibrary';

export class LayerRenderer implements IMap2DLayerRenderer {

  readonly obj3d: THREE.Object3D = new THREE.Object3D();

  private readonly layerTiles: Map<string, LayerTile> = new Map();

  constructor(readonly textureLibrary: TextureLibrary) {
  }

  addLayerTile(tile: Map2DLayerTile) {
    this.createTile(tile).appendTo(this.obj3d);
  }

  removeLayerTile(tileId: string) {
    const gt = this.destroyTile(tileId);
    if (gt !== null) {
      gt.removeFrom(this.obj3d);
      gt.dispose();
    }
 }

  updateLayerTile(_tile: Map2DLayerTile) {
    // console.log('[Map2DSceneTHREE] update grid-tile:', tile.id);
  }

  private destroyTile(id: string): LayerTile {
    if (this.layerTiles.has(id)) {
      const gt = this.layerTiles.get(id);
      this.layerTiles.delete(id);
      return gt;
    }
    return null;
  }

  private createTile(tile: Map2DLayerTile): LayerTile {
    const gt = new LayerTile(tile, this.textureLibrary);
    this.layerTiles.set(tile.id, gt);
    return gt;
  }
}
