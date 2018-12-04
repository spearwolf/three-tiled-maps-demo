import * as THREE from 'three';

export interface ITextureLibrary {
  getTextureById(tid: number): THREE.Texture;
  getTextureByName(frame: string): THREE.Texture;
}
