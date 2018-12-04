import * as THREE from 'three';

import { ITextureLibrary } from '../ITextureLibrary';

export class TextureLibrary implements ITextureLibrary {

  // async loadAtlas() {
  // }

  getTexture(_tid: number): THREE.Texture {
    return null; // TODO
  }
}
