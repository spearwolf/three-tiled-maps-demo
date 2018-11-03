import * as THREE from 'three';

import { IMap2DRenderer } from '../IMap2DRenderer';
import { Map2DGridTile } from '../Map2DGridTile';
import { Map2DView } from '../Map2DView';
import { TextureBakery } from './TextureBakery';
import { ViewFrame } from './ViewFrame';

interface IGridTileMesh {
  mesh: THREE.Mesh;
  textureBakery: TextureBakery;
}

export class Map2DSceneTHREE implements IMap2DRenderer {
  readonly scene: THREE.Scene;
  readonly mesh: Map<string, IGridTileMesh> = new Map();

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
    const mesh = this.createMesh(tile);
    this.scene.add(mesh);
  }

  removeGridTile(tileId: string) {
    console.log('[Map2DSceneTHREE] remove grid-tile:', tileId);
    const mesh = this.destroyMesh(tileId);
    if (mesh !== null) {
      this.scene.remove(mesh);
    }
 }

  updateGridTile(_tile: Map2DGridTile) {
    // console.log('[Map2DSceneTHREE] update grid-tile:', tile.id);
  }

  postRender(view: Map2DView) {
    this.viewFrame.update(view.centerX, view.centerY, view.width, view.height);
  }

  private destroyMesh(id: string): THREE.Mesh | null {
    if (this.mesh.has(id)) {
      const gtm = this.mesh.get(id);
      gtm.mesh.geometry.dispose();
      gtm.textureBakery.dispose();
      this.mesh.delete(id);
      return gtm.mesh;
    }
    return null;
  }

  private createMesh(tile: Map2DGridTile): THREE.Mesh {
    const gtm: IGridTileMesh = {
      mesh: null,
      textureBakery: new TextureBakery(256, 256),
    };
    gtm.textureBakery.make(tile.id);
    const { viewWidth, viewHeight } = tile;
    const geometry = new THREE.PlaneBufferGeometry(viewWidth, viewHeight);
    geometry.translate(tile.viewOffsetX + (viewWidth / 2), tile.viewOffsetY + (viewHeight / 2), 0);
    console.log('createMesh:', tile.viewOffsetX, tile.viewOffsetY, viewWidth, viewHeight, geometry);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: gtm.textureBakery.texture,
    });
    gtm.mesh = new THREE.Mesh(geometry, material);
    this.mesh.set(tile.id, gtm);
    return gtm.mesh;
  }
}
