/* eslint no-console: 0 */
import * as THREE from 'three';
import Stats from 'stats.js';

import { TiledMap } from './map2d/tiledmap';
import { Map2D, TextureLibrary, LayerRenderer } from './map2d/three';
import { Map2DView, Map2DViewLayer } from './map2d';

const VIEW_WIDTH = 320;
const VIEW_ASPECT = 9/16;
const calcViewHeight = (width = VIEW_WIDTH) => Math.round(width * VIEW_ASPECT);

console.log('hej ho 🦄');

THREE.Object3D.DefaultUp.set(0, 0, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x203040);

const camera3d = new THREE.PerspectiveCamera(75, 1, 0.1, 9999);
camera3d.position.set(0, -75, 350);
camera3d.lookAt(0, 0, 0);
camera3d.up.set(0, 0, 1);

const min = (a, b) => a > b ? b : a;

const halfSize = min(VIEW_WIDTH, calcViewHeight()) / 2;
const cam2dZ = 100;
const camera2d = new THREE.OrthographicCamera(-halfSize, halfSize, halfSize, -halfSize, 1, 1000 );
console.log('cam2d', -halfSize, halfSize, halfSize, -halfSize);

let curCamera = camera3d;

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: 'high-performance',
});

// see https://threejs.org/docs/#examples/loaders/GLTFLoader
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

const DPR = window.devicePixelRatio || 1;
renderer.setPixelRatio(1);

const threeContainerElement = document.getElementById('three-container');
threeContainerElement.appendChild(renderer.domElement);

const infoDisplayElement = document.createElement('div');
infoDisplayElement.setAttribute('class', 'infoDisplay infoText');
threeContainerElement.appendChild(infoDisplayElement);

window.THREE = THREE;
// eslint-disable-next-line no-undef
require('three/examples/js/controls/MapControls');

const controls = new window.THREE.MapControls(camera3d);

const PIXELATE = 'pixelate';

const urlParams = new URLSearchParams(window.location.search);

let lastSizeInfo = null;

function resize() {
  let pixelate = Number(urlParams.get(PIXELATE));
  if (isNaN(pixelate)) {
    pixelate = 1;
  }

  const { clientWidth, clientHeight } = renderer.domElement.parentNode;
  const minSize = min(clientWidth, clientHeight);
  const size = Math.floor(pixelate > 0 ? (minSize / pixelate) : (minSize * DPR));

  const newSizeInfo = `container: ${clientWidth}x${clientHeight}<br>canvas: ${size}x${size}<br>devicePixelRatio: ${DPR}<br>?${PIXELATE}=${pixelate}`;

  infoDisplayElement.innerHTML = view ? `${newSizeInfo}<br>x=${Math.round(view.centerX)} y=${Math.round(view.centerY)} [${Math.round(view.width)}x${Math.round(view.height)}]` : newSizeInfo;

  if (lastSizeInfo !== newSizeInfo) {
    lastSizeInfo = newSizeInfo;

    renderer.setSize(size, size);
    camera3d.aspect = 1;
    curCamera.updateProjectionMatrix();

    renderer.domElement.classList[pixelate !== 0 ? 'add' : 'remove'](PIXELATE);
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
  rendererShouldRender = rendererShouldRender || curCamera === camera3d;

  if (isResized || rendererShouldRender) {
    controls.update();

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

Promise.all([
  TiledMap.load('./maps/180917-a-first-map.json'),
  TextureLibrary.load('sketch-tiles.json', './atlas/'),
]).then(([tiledMap, texLib]) => {

  const { imgEl } = texLib.atlas.baseTexture;
  const el = document.querySelector('.textureAtlas');
  el.appendChild(imgEl);

  texLib.setIdNameMap([
    [1, 'empty.png'],
    [2, 'floor.png'],
    [3, 'wall-e.png'],
    [4, 'wall-n.png'],
    [5, 'wall-ns.png'],
    [6, 'wall-s.png'],
    [7, 'wall-w.png'],
    [8, 'wall-es.png'],
    [9, 'wall-esw.png'],
    [10, 'wall-ew.png'],
    [11, 'wall-ne.png'],
    [12, 'wall-nes.png'],
    [13, 'wall-nesw.png'],
    [14, 'wall-new.png'],
    [15, 'wall-nsw.png'],
    [16, 'wall-nw.png'],
    [17, 'wall-sw.png'],
  ]);

  texLib.setDefaultTexture('empty.png');

  console.log('TextureLibrary', texLib);

  const map2d = new Map2D();
  map2d.appendTo(scene);

  const mainRenderer = new LayerRenderer(texLib);
  map2d.appendLayer(mainRenderer);

  view = new Map2DView(map2d, 0, 0, VIEW_WIDTH, calcViewHeight(), 100, 100);
  view.addLayer(new Map2DViewLayer(view, mainRenderer, tiledMap.getLayer('main')));
  // view.update();

  rendererShouldRender = true;

  // const center = new Vector2Link(view, 'centerX', 'centerY');
  // center.addScalar(50);
  // view.update();
  // view.centerY -= 50;
  // view.update();

  document.addEventListener('keydown', (event) => {
    const { keyCode } = event;
    switch (keyCode) {
    case 87: // W
      speedNorth = SPEED;
      break;
    case 83: // S
      speedSouth = SPEED;
      break;
    case 65: // A
      speedWest = SPEED;
      break;
    case 68: // D
      speedEast = SPEED;
      break;
    }
  });

  const changeViewSize = (multiplyByScalar) => {
    if (view) {
      view.width *= multiplyByScalar;
      view.height = calcViewHeight(view.width);
      const halfSize = min(view.width, view.height) / 2;
      camera2d.left = -halfSize;
      camera2d.right = halfSize;
      camera2d.top = halfSize;
      camera2d.bottom = -halfSize;
      camera2d.updateProjectionMatrix();
      rendererShouldRender = true;
    }
  };

  document.addEventListener('keyup', (event) => {
    const { keyCode } = event;
    switch (keyCode) {
    case 87: // W
      speedNorth = 0;
      break;
    case 83: // A
      speedSouth = 0;
      break;
    case 65: // S
      speedWest = 0;
      break;
    case 68: // D
      speedEast = 0;
      break;
    case 49: // 1
      curCamera = camera2d;
      map2d.viewFrame.container.visible = false;
      controls.enabled = false;
      rendererShouldRender = true;
      break;
    case 50: // 2
      curCamera = camera3d;
      map2d.viewFrame.container.visible = true;
      controls.enabled = true;
      rendererShouldRender = true;
      break;
    case 107: // numPad: add
    case 187: // +
      changeViewSize(curCamera === camera3d ? 1.1 : 0.9);
      break;
    case 109: // numPad: sub
    case 189: // -
      changeViewSize(curCamera === camera2d ? 1.1 : 0.9);
      break;
    }
  });
});
