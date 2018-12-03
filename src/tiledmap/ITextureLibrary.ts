import * as THREE from 'three';

export interface ITextureLibrary {
  getTexture(tid: number): THREE.Texture;
}
