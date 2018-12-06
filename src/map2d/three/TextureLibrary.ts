import * as THREE from 'three';

import { Texture } from '../Texture';
import { TextureAtlas } from '../TextureAtlas';

export class TextureLibrary {

  static async load(path: string, basePath: string = './'): Promise<TextureLibrary> {
    return new TextureLibrary(await TextureAtlas.load(path, basePath));
  }

  baseTexture: THREE.Texture;

  private texIdMap: Map<number, string> = new Map();
  private defaultTexName: string;

  constructor(readonly atlas: TextureAtlas) {
    this.baseTexture = new THREE.Texture(atlas.baseTexture.imgEl);
    this.baseTexture.flipY = false;
    this.baseTexture.magFilter = THREE.NearestFilter;
    this.baseTexture.needsUpdate = true;
  }

  get textureNames() {
    return this.atlas.frameNames();
  }

  dispose() {
    if (this.baseTexture) {
      this.baseTexture.dispose();
      this.baseTexture = null;
    }
  }

  getTextureById(id: number): Texture {
    const name = this.texIdMap.get(id) || this.defaultTexName;
    if (name) {
      return this.atlas.frame(name) || null;
    }
    return null;
  }

  getTextureByName(frame: string): Texture {
    return this.atlas.frame(frame) || this.atlas.frame(this.defaultTexName) || null;
  }

  getRandomTexture(): Texture {
    const { textureNames } = this;
    const randomName = textureNames[Math.floor(Math.random() * textureNames.length)];
    return this.getTextureByName(randomName);
  }

  setIdNameMap(idNameMap: [[number, string]]) {
    idNameMap.forEach(([id, name]) => this.texIdMap.set(id, name));
  }

  setDefaultTexture(name: string) {
    this.defaultTexName = name;
  }
}
