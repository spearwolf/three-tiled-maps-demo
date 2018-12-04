import * as THREE from 'three';

import { Map2D } from './Map2D';

export class ViewFrame {

  color = 0xff0032;

  zOffset = 1;

  private container: THREE.Object3D = null;
  private linesCreated = false;

  constructor(readonly map2d: Map2D) {
    this.container = new THREE.Object3D();
  }

  appendTo(obj: THREE.Object3D) {
    this.createMesh();
    obj.add(this.container);
  }

  removeFrom(obj: THREE.Object3D) {
    obj.remove(this.container);
  }

  update(x: number, y: number, width: number, height: number) {
    this.container.position.set(x, y, this.zOffset);
    this.container.scale.set(width, height, 1);
    this.container.matrixWorldNeedsUpdate = true;
  }

  private createMesh() {
    if (!this.linesCreated) {
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
      this.container.add(lines);
      this.linesCreated = true;
    }
  }
}
