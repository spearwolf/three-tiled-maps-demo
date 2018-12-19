import * as THREE from 'three';

import { IMap2DRenderer } from '../IMap2DRenderer';
import { Map2DView } from '../Map2DView';

import { IMap2DLayer } from './IMap2DLayer';

export class Map2D extends THREE.Object3D implements IMap2DRenderer {

  static BeginRenderEvent = 'map2dbeginrender';
  static EndRenderEvent = 'map2dendrender';

  private readonly map2dLayers = new Set<IMap2DLayer>();

  appendLayer(layer: IMap2DLayer) {
    if (!this.map2dLayers.has(layer)) {
      this.map2dLayers.add(layer);
      this.add(layer.getObject3D());
    }
  }

  removeLayer(layer: IMap2DLayer) {
    if (this.map2dLayers.has(layer)) {
      this.map2dLayers.delete(layer);
      this.remove(layer.getObject3D());
    }
  }

  beginRender(view: Map2DView) {
    this.children.forEach((obj3d) => obj3d.dispatchEvent({ type: Map2D.BeginRenderEvent, map2d: this, view }));
  }

  endRender(view: Map2DView) {
    this.children.forEach((obj3d) => obj3d.dispatchEvent({ type: Map2D.EndRenderEvent, map2d: this, view }));
  }
}
