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

const PIXELATE = 'pixelate';

let lastSizeInfo = null;

function resize() {
  const pixelate = parseInt(urlParams.get(PIXELATE), 10) || 1;
  const { clientWidth, clientHeight } = renderer.domElement.parentNode;
  const minSize = min(clientWidth, clientHeight);
  const newSizeInfo = `container: ${clientWidth}x${clientHeight}<br>canvas: ${minSize}x${minSize}<br>${PIXELATE}=${pixelate}`;

  if (lastSizeInfo !== newSizeInfo) {
    infoDisplayElement.innerHTML = newSizeInfo;
    lastSizeInfo = newSizeInfo;

    if (pixelate > 1) {
      renderer.domElement.classList.add(PIXELATE);
    } else {
      renderer.domElement.classList.remove(PIXELATE);
    }
    const size = Math.floor(minSize / pixelate);

    renderer.setSize(size, size);
    renderer.domElement.style.width = `${minSize}px`;
    renderer.domElement.style.height = `${minSize}px`;
    camera.aspect = 1;

    camera.updateProjectionMatrix();
    return true;
  }
}

camera.position.set(0, -75, 350);
camera.lookAt(0, 0, 0);
camera.up.set(0, 0, 1);

let rendererShouldRender = true;

const SPEED = 130; // pixels per second

let view = null;

let speedNorth = 0;
let speedEast = 0;
let speedSouth = 0;
let speedWest = 0;

let lastTime = 0;

function animate(time) {
  requestAnimationFrame(animate);
  let isResized = resize();

  let t = 0;
  if (lastTime ===  0) {
    lastTime = time / 1000;
  } else {
    const t0 = time / 1000;
    t = t0 - lastTime;
    lastTime = t0;
  }

  if (speedNorth) {
    view.centerY += speedNorth * t;
  }
  if (speedSouth) {
    view.centerY -= speedSouth * t;
  }
  if (speedEast) {
    view.centerX += speedEast * t;
  }
  if (speedWest) {
    view.centerX -= speedWest * t;
  }

  rendererShouldRender = rendererShouldRender || 0 < (speedNorth + speedEast + speedSouth + speedWest);

  if (isResized || rendererShouldRender) {
    if (view) {
      view.update();
    }
    renderer.render(scene, camera);
    rendererShouldRender = false;
  }
}

requestAnimationFrame(animate);

// load tiled map ////////////////////////////////////////////////////

loadTiledMap("./maps/180917-a-first-map.json").then((tiledMap) => {
  const map2dScene = new Map2DScene();
  map2dScene.appendTo(scene);

  view = new Map2DView(map2dScene, 0, 0, 320, 200, 100, 100);
  view.appendLayer(...tiledMap.getAllLayers());
  // view.update();

  rendererShouldRender = true;

  // const center = new Vector2Link(view, 'centerX', 'centerY');
  // center.addScalar(50);
  // view.update();
  // view.centerY -= 50;
  // view.update();

  document.addEventListener("keydown", (event) => {
    const { key } = event;
    switch (key) {
      case "ArrowUp":
        speedNorth = SPEED;
        break;
      case "ArrowDown":
        speedSouth = SPEED;
        break;
      case "ArrowLeft":
        speedWest = SPEED;
        break;
      case "ArrowRight":
        speedEast = SPEED;
        break;
    }
  });

  document.addEventListener("keyup", (event) => {
    const { key } = event;
    switch (key) {
      case "ArrowUp":
        speedNorth = 0;
        break;
      case "ArrowDown":
        speedSouth = 0;
        break;
      case "ArrowLeft":
        speedWest = 0;
        break;
      case "ArrowRight":
        speedEast = 0;
        break;
    }
  });
});
