import * as THREE from 'three';
// import GLTFLoader from 'three-gltf-loader';

import { Map2DGridTile } from './tiledmap/Map2DGridTile';
// import { Map2DSceneTHREE, TextureBakery } from './tiledmap/Map2DSceneTHREE';
import { Map2DSceneTHREE } from './tiledmap/Map2DSceneTHREE';
import { Map2DView } from './tiledmap/Map2DView';
import { TiledMap } from './tiledmap/TiledMap';
// import { Vector2Link } from './tiledmap/Vector2Link';

import loadTiledMap from './loadTiledMap';

console.log('hej ho 🦄');

THREE.Object3D.DefaultUp.set(0, 0, 1);
console.log('Object3D.DefaultUp', THREE.Object3D.DefaultUp.x, THREE.Object3D.DefaultUp.y, THREE.Object3D.DefaultUp.z);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// see https://threejs.org/docs/#examples/loaders/GLTFLoader
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

renderer.setPixelRatio(devicePixelRatio || 1);
renderer.domElement.classList.add('three');
document.body.appendChild(renderer.domElement);

function resize(): void {
  const el = renderer.domElement;
  const container = el.parentNode as HTMLElement;
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

function animate(_time: number): void {
  requestAnimationFrame(animate);
  resize();

  // const seconds = time / 1000;
  // scene.rotation.z = seconds * -0.4;

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

/*
const lights = [
  new THREE.PointLight(0xffffff, 1, 0),
  new THREE.PointLight(0xffffff, 1, 0),
  new THREE.PointLight(0xffffff, 1, 0),
];

lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(- 100, - 200, - 100);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
const meshMaterial = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true });
scene.add(new THREE.Mesh(geometry, meshMaterial));
*/

// load tiled map ////////////////////////////////////////////////////

loadTiledMap('./maps/180917-a-first-map.json').then((tiledMap: TiledMap) => {
  console.log('tiledMap', tiledMap);
  console.log('(-1,0)->(4,6)', tiledMap.getLayer('main').getTileIdsWithin(-1, 0, 4, 6));

  const tile = new Map2DGridTile(tiledMap.getLayer('main'), 2, 2).setPosition(10, 0).fetchTileIds();
  console.log('(10,0)->(2,2)', tile);

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

  const translate = (x: number, y: number) => {
    view.centerX += x;
    view.centerY += y;
    view.update();
  };

  document.addEventListener('keydown', (event) => {
    const { key } = event;
    switch (key) {
      case 'ArrowUp':
        translate(0, 10);
        break;
      case 'ArrowDown':
        translate(0, -10);
        break;
      case 'ArrowLeft':
        translate(-10, 0);
        break;
      case 'ArrowRight':
        translate(10, 0);
        break;
    }
  });
});

// load gltf mesh /////////////////////////////////////////////////////
/*
const loader: any = new GLTFLoader();
loader.load(
  './gltf/flat-ground.gltf',
  (gltf: any) => {
    scene.add(gltf.scene);
    console.log(gltf);
  },
);
*/

// texture bakery example /////////////////////////////////////////////////////
// const textureBakery = new TextureBakery(256, 256);
// textureBakery.appendTo(document.body);
// textureBakery.make('TextureBakery sample');
