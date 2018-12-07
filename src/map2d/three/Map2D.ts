import * as THREE from 'three';

import { IMap2DRenderer } from '../IMap2DRenderer';
import { Map2DView } from '../Map2DView';

import { Map2DLayer } from './Map2DLayer';
import { ViewFrame } from './ViewFrame';

const appendToScene = (scene: THREE.Object3D, obj: THREE.Object3D) => {
  if (!scene.children.includes(obj)) {
    scene.add(obj);
    return true;
  }
  return false;
};

const removeFromScene = (scene: THREE.Object3D, ...objects: THREE.Object3D[]) => {
  objects.forEach((obj) => scene.remove(obj));
};

export class Map2D implements IMap2DRenderer {

  viewFrame: ViewFrame;
  viewFrameZOffset = 0.5;

  private readonly scene = new THREE.Object3D();

  constructor() {
    this.viewFrame = new ViewFrame(this);
  }

  appendTo(scene: THREE.Object3D) {
    if (appendToScene(scene, this.scene)) {
      this.viewFrame.appendTo(scene);
      this.viewFrame.zOffset = this.viewFrameZOffset;
    }
  }

  removeFrom(scene: THREE.Object3D) {
    removeFromScene(scene, this.scene);
    this.viewFrame.removeFrom(scene);
  }

  appendLayer(layer: Map2DLayer) {
    appendToScene(this.scene, layer.obj3d);
  }

  removeLayer(layer: Map2DLayer) {
    removeFromScene(this.scene, layer.obj3d);
  }

  beginRender(view: Map2DView) {
    this.viewFrame.update(view.centerX, view.centerY, view.width, view.height);
  }

  endRender(_view: Map2DView) {
    // nothing to do here
  }
}
