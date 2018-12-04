import * as THREE from 'three';

import { IMap2DRenderer } from '../IMap2DRenderer';
import { Map2DGridTile } from '../Map2DGridTile';
import { Map2DView } from '../Map2DView';

import { GridTile } from './GridTile';
import { ViewFrame } from './ViewFrame';

export class Map2D implements IMap2DRenderer {
  readonly scene: THREE.Scene;
  readonly gridTiles: Map<string, GridTile> = new Map();

  viewFrame: ViewFrame;
  viewFrameZOffset = 0.5;

  constructor() {
    this.scene = new THREE.Scene();
    this.viewFrame = new ViewFrame(this);
  }

  appendTo(scene: THREE.Scene) {
    if (!scene.children.includes(this.scene)) {
      scene.add(this.scene);
      this.viewFrame.appendTo(scene);
      this.viewFrame.zOffset = this.viewFrameZOffset;
    }
  }

  removeFrom(scene: THREE.Scene) {
    scene.remove(this.scene);
    this.viewFrame.removeFrom(scene);
  }

  addGridTile(tile: Map2DGridTile) {
    console.log('[Map2DSceneTHREE] add grid-tile:', tile.id);
    this.createGridTile(tile).appendTo(this.scene);
  }

  removeGridTile(tileId: string) {
    console.log('[Map2DSceneTHREE] remove grid-tile:', tileId);
    const gt = this.destroyGridTile(tileId);
    if (gt !== null) {
      gt.removeFrom(this.scene);
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
