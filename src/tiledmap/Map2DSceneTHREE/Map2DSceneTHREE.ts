import * as THREE from 'three';

import { IMap2DRenderer } from '../IMap2DRenderer';
import { Map2DGridTile } from '../Map2DGridTile';
import { Map2DView } from '../Map2DView';

import { GridTileMesh } from './GridTileMesh';
import { ViewFrame } from './ViewFrame';

export class Map2DSceneTHREE implements IMap2DRenderer {
  readonly scene: THREE.Scene;
  readonly mesh: Map<string, GridTileMesh> = new Map();

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
    const gtm = this.createMesh(tile);
    this.scene.add(gtm.mesh);
  }

  removeGridTile(tileId: string) {
    console.log('[Map2DSceneTHREE] remove grid-tile:', tileId);
    const gtm = this.destroyMesh(tileId);
    if (gtm !== null) {
      this.scene.remove(gtm.mesh);
      gtm.dispose();
    }
 }

  updateGridTile(_tile: Map2DGridTile) {
    // console.log('[Map2DSceneTHREE] update grid-tile:', tile.id);
  }

  postRender(view: Map2DView) {
    this.viewFrame.update(view.centerX, view.centerY, view.width, view.height);
  }

  private destroyMesh(id: string): GridTileMesh {
    if (this.mesh.has(id)) {
      const gtm = this.mesh.get(id);
      this.mesh.delete(id);
      return gtm;
    }
    return null;
  }

  private createMesh(tile: Map2DGridTile): GridTileMesh {
    const gtm = new GridTileMesh(tile);
    this.mesh.set(tile.id, gtm);
    return gtm;
  }
}
