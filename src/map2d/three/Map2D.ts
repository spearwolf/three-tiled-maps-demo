import * as THREE from 'three';

import { IMap2DRenderer } from '../IMap2DRenderer';
import { Map2DView } from '../Map2DView';

import { Map2DFlat2DTilesLayer } from './Map2DFlat2DTilesLayer';

export class Map2D extends THREE.Object3D implements IMap2DRenderer {

  static BeginRenderEvent = 'map2dbeginrender';
  static EndRenderEvent = 'map2dendrender';

  private readonly map2dLayers = new Set<Map2DFlat2DTilesLayer>();

  appendLayer(layer: Map2DFlat2DTilesLayer) {
    if (!this.map2dLayers.has(layer)) {
      this.map2dLayers.add(layer);
      this.add(layer.obj3d);
    }
  }

  removeLayer(layer: Map2DFlat2DTilesLayer) {
    if (this.map2dLayers.has(layer)) {
      this.map2dLayers.delete(layer);
      this.remove(layer.obj3d);
    }
  }

  beginRender(view: Map2DView) {
    this.children.forEach((obj3d) => obj3d.dispatchEvent({ type: Map2D.BeginRenderEvent, map2d: this, view }));
  }

  endRender(view: Map2DView) {
    this.children.forEach((obj3d) => obj3d.dispatchEvent({ type: Map2D.EndRenderEvent, map2d: this, view }));
  }
}
