import * as THREE from 'three';

import { IMap2DLayerRenderer } from '../IMap2DLayerRenderer';
import { Map2DViewTile } from '../Map2DViewTile';

import { LayerTile } from './LayerTile';
import { TextureLibrary } from './TextureLibrary';

export class LayerRenderer implements IMap2DLayerRenderer {

  readonly obj3d: THREE.Object3D = new THREE.Object3D();

  private readonly layerTiles: Map<string, LayerTile> = new Map();

  constructor(readonly textureLibrary: TextureLibrary) {
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

  private destroyTile(id: string): LayerTile {
    if (this.layerTiles.has(id)) {
      const gt = this.layerTiles.get(id);
      this.layerTiles.delete(id);
      return gt;
    }
    return null;
  }

  private createTile(tile: Map2DViewTile): LayerTile {
    const gt = new LayerTile(tile, this.textureLibrary);
    this.layerTiles.set(tile.id, gt);
    return gt;
  }
}
