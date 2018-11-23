import * as THREE from 'three';

import { Map2DScene } from './Map2DScene';

export class ViewFrame {
  readonly map2dScene: Map2DScene;
  readonly scene: THREE.Scene;

  color = 0xff0032;

  zOffset = 1;

  private obj3d: THREE.Object3D = null;

  constructor(map2dScene: Map2DScene) {
    this.map2dScene = map2dScene;
    this.scene = new THREE.Scene();
  }

  appendTo(scene: THREE.Scene) {
    this.createMesh();
    scene.add(this.scene);
  }

  removeFrom(scene: THREE.Scene) {
    scene.remove(this.scene);
  }

  update(x: number, y: number, width: number, height: number) {
    this.scene.position.set(x, y, this.zOffset);
    this.scene.scale.set(width, height, 1);
    this.scene.matrixWorldNeedsUpdate = true;
  }

  private createMesh() {
    if (this.obj3d === null) {
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
      this.obj3d = new THREE.LineSegments(geometry, material) ;
      this.scene.add(this.obj3d);
    }
  }
}
