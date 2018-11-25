import * as THREE from "three";

import { Map2DScene } from "./tiledmap/Map2DSceneTHREE";
import { Map2DView } from "./tiledmap/Map2DView";

import loadTiledMap from "./loadTiledMap";

const urlParams = new URLSearchParams(window.location.search);

console.log("hej ho 🦄");

THREE.Object3D.DefaultUp.set(0, 0, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: "high-performance",
});

// see https://threejs.org/docs/#examples/loaders/GLTFLoader
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

const DPR = window.devicePixelRatio || 1;

renderer.setPixelRatio(DPR);

const threeContainerElement = document.getElementById('three-container');
threeContainerElement.appendChild(renderer.domElement);

const infoDisplayElement = document.createElement('div');
infoDisplayElement.classList.add('infoDisplay');
threeContainerElement.appendChild(infoDisplayElement);

const min = (a, b) => a > b ? b : a;

let lastSize = null;

function resize() {
  const container = renderer.domElement.parentNode;
  const s = min(container.clientWidth, container.clientHeight);
  const pixelate = parseInt(urlParams.get('pixelate'), 10) || 1;

  const newSize = `${s}x${s}\npixelate=${pixelate}`;
  if (lastSize !== newSize) {
    lastSize = newSize;
    infoDisplayElement.innerHTML = newSize.replace('\n', '<br>');

    if (pixelate > 1) {
      renderer.domElement.classList.add('pixelate');
    } else {
      renderer.domElement.classList.remove('pixelate');
    }
    const size = Math.floor(s / pixelate);

    renderer.setSize(size, size);
    renderer.domElement.style.width = `${Math.floor(size * pixelate)}px`;
    renderer.domElement.style.height = `${Math.floor(size * pixelate)}px`;
    camera.aspect = 1;
    camera.updateProjectionMatrix();

    return true;
  }
}

camera.position.set(0, -100, 300);
camera.lookAt(0, 0, 0);
camera.up.set(0, 0, 1);

let rendererShouldRender = true;

function animate() {
  requestAnimationFrame(animate);
  let isResized = resize();

  // const seconds = time / 1000;
  // scene.rotation.z = seconds * -0.4;

  if (isResized || rendererShouldRender) {
    renderer.render(scene, camera);
    rendererShouldRender = false;
  }
}

requestAnimationFrame(animate);

// load tiled map ////////////////////////////////////////////////////

loadTiledMap("./maps/180917-a-first-map.json").then((tiledMap) => {
  const map2dScene = new Map2DScene();
  map2dScene.appendTo(scene);

  const view = new Map2DView(map2dScene, 0, 0, 320, 200, 100, 100);
  view.appendLayer(...tiledMap.getAllLayers());
  view.update();

  rendererShouldRender = true;

  // const center = new Vector2Link(view, 'centerX', 'centerY');
  // center.addScalar(50);
  // view.update();
  // view.centerY -= 50;
  // view.update();

  const translate = (x, y) => {
    view.centerX += x;
    view.centerY += y;
    view.update();
    rendererShouldRender = true;
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
