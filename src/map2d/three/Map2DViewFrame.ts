import * as THREE from 'three';

import { IMap2DEvent } from './IMap2DEvent';
import { Map2D } from './Map2D';

export class Map2DViewFrame extends THREE.Object3D {

  readonly map2d: Map2D;

  color: number;

  zOffset: number;

  constructor(map2d: Map2D, color = 0xff0032, zOffset = 0.5) {
    super();

    this.map2d = map2d;

    this.color = color;
    this.zOffset = zOffset;

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
