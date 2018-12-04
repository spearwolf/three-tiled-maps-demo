import * as THREE from 'three';

import { IMap2DRenderer } from '../IMap2DRenderer';
import { Map2DGridTile } from '../Map2DGridTile';
import { Map2DView } from '../Map2DView';

import { GridTile } from './GridTile';
import { ViewFrame } from './ViewFrame';

export class Map2D implements IMap2DRenderer {
  readonly container: THREE.Object3D;
  readonly gridTiles: Map<string, GridTile> = new Map();

  viewFrame: ViewFrame;
  viewFrameZOffset = 0.5;

  constructor() {
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

  addGridTile(tile: Map2DGridTile) {
    console.log('[Map2DSceneTHREE] add grid-tile:', tile.id);
    this.createGridTile(tile).appendTo(this.container);
  }

  removeGridTile(tileId: string) {
    console.log('[Map2DSceneTHREE] remove grid-tile:', tileId);
    const gt = this.destroyGridTile(tileId);
    if (gt !== null) {
      gt.removeFrom(this.container);
      gt.dispose();
    }
 }

  updateGridTile(_tile: Map2DGridTile) {
    // console.log('[Map2DSceneTHREE] update grid-tile:', tile.id);
  }

  postRender(view: Map2DView) {
    this.viewFrame.update(view.centerX, view.centerY, view.width, view.height);
  }

  private destroyGridTile(id: string): GridTile {
    if (this.gridTiles.has(id)) {
      const gt = this.gridTiles.get(id);
      this.gridTiles.delete(id);
      return gt;
    }
    return null;
  }

  private createGridTile(tile: Map2DGridTile): GridTile {
    const gt = new GridTile(tile);
    this.gridTiles.set(tile.id, gt);
    return gt;
  }
}
