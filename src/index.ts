import * as THREE from 'three';
import loadTiledMap from './loadTiledMap';
import { MapTile } from './tiledmap/MapTile';
import { TiledMap } from './tiledmap/TiledMap';

console.log('hej ho 🦄');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setPixelRatio(devicePixelRatio || 1);
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

scene.rotation.x = -0.8;
camera.position.z = 2;

function animate(time: number): void {
  requestAnimationFrame(animate);
  resize();

  const seconds = time / 1000;
  scene.rotation.z = seconds * 0.4;

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

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

// load tiled map ////////////////////////////////////////////////////

loadTiledMap('./maps/180917-a-first-map.json').then((tiledMap: TiledMap) => {
  console.log('tiledMap', tiledMap);
  console.log('(-1,0)->(4,6)', tiledMap.layers.get('main').getTileIdsAt(-1, 0, 4, 6));

  const tile = new MapTile(tiledMap.layers.get('main'), 2, 2).setPosition(10, 0).fetchTileIds();
  console.log('(10,0)->(2,2)', tile);
});
