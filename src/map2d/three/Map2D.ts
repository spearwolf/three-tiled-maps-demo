import * as THREE from 'three';

import { IMap2DRenderer } from '../IMap2DRenderer';
import { Map2DLayerTile } from '../Map2DLayerTile';
import { Map2DView } from '../Map2DView';

import { LayerTile } from './LayerTile';
import { TextureLibrary } from './TextureLibrary';
import { ViewFrame } from './ViewFrame';

export class Map2D implements IMap2DRenderer {

  viewFrame: ViewFrame;
  viewFrameZOffset = 0.5;

  private readonly container: THREE.Object3D;
  private readonly layerTiles: Map<string, LayerTile> = new Map();

  constructor(readonly textureLibrary: TextureLibrary) {
    this.container = new THREE.Object3D();
    this.viewFrame = new ViewFrame(this);
  }

  appendTo(obj: THREE.Object3D) {
    if (!obj.children.includes(this.container)) {
      obj.add(this.container);
      this.viewFrame.appendTo(obj);
      this.viewFrame.zOffset = this.viewFrameZOffset;
    }
  }

  removeFrom(obj: THREE.Object3D) {
    obj.remove(this.container);
    this.viewFrame.removeFrom(obj);
  }

  addLayerTile(tile: Map2DLayerTile) {
    this.createTile(tile).appendTo(this.container);
  }

  removeLayerTile(tileId: string) {
    const gt = this.destroyTile(tileId);
    if (gt !== null) {
      gt.removeFrom(this.container);
      gt.dispose();
    }
 }

  updateLayerTile(_tile: Map2DLayerTile) {
    // console.log('[Map2DSceneTHREE] update grid-tile:', tile.id);
  }

  postRender(view: Map2DView) {
    this.viewFrame.update(view.centerX, view.centerY, view.width, view.height);
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
