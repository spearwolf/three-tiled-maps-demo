// tslint:disable:no-console
import * as THREE from "three";

import { Map2DSceneTHREE } from "./tiledmap/Map2DSceneTHREE";
import { Map2DView } from "./tiledmap/Map2DView";

import loadTiledMap from "./loadTiledMap";

console.log("hej ho 🦄");

THREE.Object3D.DefaultUp.set(0, 0, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// see https://threejs.org/docs/#examples/loaders/GLTFLoader
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

renderer.setPixelRatio(devicePixelRatio || 1);
renderer.domElement.classList.add("three");
document.body.appendChild(renderer.domElement);

function resize() {
  const el = renderer.domElement;
  const container = el.parentNode;
  const w = container.clientWidth;
  const h = container.clientHeight;

  if (w !== el.clientWidth || h !== el.clientHeight) {
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
}

resize();

camera.position.set(0, -100, 300);
camera.lookAt(0, 0, 0);
camera.up.set(0, 0, 1);

function animate() {
  requestAnimationFrame(animate);
  resize();

  // const seconds = time / 1000;
  // scene.rotation.z = seconds * -0.4;

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

// load tiled map ////////////////////////////////////////////////////

loadTiledMap("./maps/180917-a-first-map.json").then((tiledMap) => {
  const map2dScene = new Map2DSceneTHREE();
  map2dScene.appendTo(scene);

  const view = new Map2DView(map2dScene, 0, 0, 320, 200, 100, 100);
  view.appendLayer(...tiledMap.getAllLayers());
  view.update();

  // const center = new Vector2Link(view, 'centerX', 'centerY');
  // center.addScalar(50);
  // view.update();
  // view.centerY -= 50;
  // view.update();

  const translate = (x, y) => {
    view.centerX += x;
    view.centerY += y;
    view.update();
  };

  document.addEventListener("keydown", (event) => {
    const { key } = event;
    switch (key) {
      case "ArrowUp":
        translate(0, 10);
        break;
      case "ArrowDown":
        translate(0, -10);
        break;
      case "ArrowLeft":
        translate(-10, 0);
        break;
      case "ArrowRight":
        translate(10, 0);
        break;
    }
  });
});
