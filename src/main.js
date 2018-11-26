/* eslint no-console: 0 */
import * as THREE from 'three';
import Stats from 'stats.js';

import { Map2DScene } from './tiledmap/Map2DSceneTHREE';
import { Map2DView } from './tiledmap/Map2DView';

import loadTiledMap from './loadTiledMap';

const urlParams = new URLSearchParams(window.location.search);

console.log('hej ho 🦄');

THREE.Object3D.DefaultUp.set(0, 0, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x203040);

const camera3d = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera3d.position.set(0, -75, 350);
camera3d.lookAt(0, 0, 0);
camera3d.up.set(0, 0, 1);

const halfWidth = window.innerWidth / 2;
const halfHeight = window.innerHeight / 2;
const scale2d = 1/2.2;
const cam2dZ = 100;
const camera2d = new THREE.OrthographicCamera(-halfWidth * scale2d, halfWidth * scale2d, halfHeight * scale2d, -halfHeight * scale2d, 1, 1000 );

let curCamera = camera3d;

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: 'high-performance',
});

// see https://threejs.org/docs/#examples/loaders/GLTFLoader
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

const DPR = window.devicePixelRatio || 1;
const PIXELATE_MIN = 1 / DPR;

renderer.setPixelRatio(DPR);

const threeContainerElement = document.getElementById('three-container');
threeContainerElement.appendChild(renderer.domElement);

const infoDisplayElement = document.createElement('div');
infoDisplayElement.setAttribute('class', 'infoDisplay infoText');
threeContainerElement.appendChild(infoDisplayElement);

const min = (a, b) => a > b ? b : a;

const PIXELATE = 'pixelate';

let lastSizeInfo = null;

function resize() {
  let pixelate = Number(urlParams.get(PIXELATE));
  if (pixelate === 0 || isNaN(pixelate)) {
    pixelate = 1;
  }
  if (pixelate < PIXELATE_MIN) {
    pixelate = PIXELATE_MIN;
  }

  const { clientWidth, clientHeight } = renderer.domElement.parentNode;
  const minSize = min(clientWidth, clientHeight);
  const size = Math.floor(minSize / pixelate);
  const newSizeInfo = `container: ${clientWidth}x${clientHeight}<br>canvas: ${size}x${size}<br>?${PIXELATE}=${pixelate}`;

  infoDisplayElement.innerHTML = view ? `${newSizeInfo}<br>x=${Math.round(view.centerX)} y=${Math.round(view.centerY)}` : newSizeInfo;

  if (lastSizeInfo !== newSizeInfo) {
    lastSizeInfo = newSizeInfo;

    renderer.setSize(size, size);
    camera3d.aspect = 1;
    curCamera.updateProjectionMatrix();

    renderer.domElement.classList[PIXELATE > 1 ? 'add' : 'remove'](PIXELATE);
    renderer.domElement.style.width = `${minSize}px`;
    renderer.domElement.style.height = `${minSize}px`;
    return true;
  }
}

const stats = new Stats();
stats.showPanel(1);
document.body.appendChild(stats.dom);

let rendererShouldRender = true;

const SPEED = 130; // pixels per second

let view = null;

let speedNorth = 0;
let speedEast = 0;
let speedSouth = 0;
let speedWest = 0;

let lastTime = 0;

function render(time) {
  let isResized = resize();

  let t = 0;
  if (lastTime ===  0) {
    lastTime = time / 1000;
  } else {
    const t0 = time / 1000;
    t = t0 - lastTime;
    lastTime = t0;
  }

  rendererShouldRender = rendererShouldRender || 0 < (speedNorth + speedEast + speedSouth + speedWest);

  if (isResized || rendererShouldRender) {
    if (view) {
      view.centerY += speedNorth * t;
      view.centerY -= speedSouth * t;
      view.centerX += speedEast * t;
      view.centerX -= speedWest * t;
      view.update();

      camera2d.position.set(view.centerX, view.centerY, cam2dZ);
    }
    renderer.render(scene, curCamera);
    rendererShouldRender = false;
  }
}

function animate(time) {
  stats.begin();
  render(time);
  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// load tiled map ////////////////////////////////////////////////////

loadTiledMap('./maps/180917-a-first-map.json').then((tiledMap) => {
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

  document.addEventListener('keydown', (event) => {
    const { key } = event;
    switch (key) {
    case 'ArrowUp':
      speedNorth = SPEED;
      break;
    case 'ArrowDown':
      speedSouth = SPEED;
      break;
    case 'ArrowLeft':
      speedWest = SPEED;
      break;
    case 'ArrowRight':
      speedEast = SPEED;
      break;
    }
  });

  document.addEventListener('keyup', (event) => {
    const { key } = event;
    switch (key) {
    case 'ArrowUp':
      speedNorth = 0;
      break;
    case 'ArrowDown':
      speedSouth = 0;
      break;
    case 'ArrowLeft':
      speedWest = 0;
      break;
    case 'ArrowRight':
      speedEast = 0;
      break;
    case '1':
      curCamera = camera2d;
      rendererShouldRender = true;
      break;
    case '2':
      curCamera = camera3d;
      rendererShouldRender = true;
      break;
    }
  });
});
