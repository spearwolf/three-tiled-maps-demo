import * as THREE from 'three';

import { IMap2DEvent } from './IMap2DEvent';
import { Map2D } from './Map2D';

export class Map2DViewFrame extends THREE.Object3D {

  constructor(readonly map2d: Map2D, public color = 0xff0032, public zOffset = 0.5) {
    super();

    const l = 0.5;
    const c = 0.02;
    const geometry = new THREE.Geometry();

    geometry.vertices.push(
      new THREE.Vector3(-l, -l),
      new THREE.Vector3(l, -l),
      new THREE.Vector3(l, -l),
      new THREE.Vector3(l, l),
      new THREE.Vector3(l, l),
      new THREE.Vector3(-l, l),
      new THREE.Vector3(-l, l),
      new THREE.Vector3(-l, -l),

      new THREE.Vector3(-c, 0),
      new THREE.Vector3(c, 0),

      new THREE.Vector3(0, -c),
      new THREE.Vector3(0, c),
    );

    const material = new THREE.LineBasicMaterial({ color: this.color });
    const lines = new THREE.LineSegments(geometry, material) ;
    this.add(lines);

    this.addEventListener(Map2D.BeginRenderEvent, (event: IMap2DEvent) => {
      const { view } = event;
      this.updateView(view.centerX, view.centerY, view.width, view.height);
    });
  }

  updateView(x: number, y: number, width: number, height: number) {
    this.position.set(x, y, this.zOffset);
    this.scale.set(width, height, 1);
    this.matrixWorldNeedsUpdate = true;
  }
}
