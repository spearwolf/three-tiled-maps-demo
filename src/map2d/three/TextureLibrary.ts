import * as THREE from 'three';

import { ITextureAtlasData } from '../ITextureAtlasData';
import { ITextureLibrary } from '../ITextureLibrary';

const loadTexture = ( url: string, loader: THREE.TextureLoader): Promise<THREE.Texture> => {
  return new Promise((onLoad) => {
    loader.load(url, onLoad);
  });
};

export class TextureLibrary implements ITextureLibrary {

  private allTextures: Set<THREE.Texture> = new Set();
  private texNameMap: Map<string, THREE.Texture> = new Map();
  private texIdMap: Map<number, string> = new Map();
  private defaultTexName: string;

  get textureNames() {
    return Array.from(this.texNameMap.keys());
  }

  static async loadFromAtlas(path: string, basePath: string = './'): Promise<TextureLibrary> {
    const atlas = await fetch(`${basePath}/${path}`).then((response) => response.json()) as ITextureAtlasData;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath(basePath);
    const baseTex = await loadTexture(atlas.meta.image, textureLoader);
    const texLib = new TextureLibrary();
    texLib.importFromAtlas(atlas, baseTex);
    return texLib;
  }

  importFromAtlas(data: ITextureAtlasData, base: THREE.Texture) {
    this.allTextures.add(base);
    Object.keys(data.frames).forEach((name: string) => {
      const tex = base.clone();
      const frame = data.frames[name];
      tex.repeat.set(frame.w / base.image.width, frame.h / base.image.height);
      tex.offset.set(frame.x / base.image.width, (frame.h / base.image.height) - (frame.y / base.image.height));
      tex.needsUpdate = true;
      tex.name = name;
      this.texNameMap.set(name, tex);
    });
  }

  dispose() {
    Array.from(this.allTextures).forEach((tex) => tex.dispose());
    this.allTextures.clear();
  }

  getTextureById(id: number): THREE.Texture {
    const name = this.texIdMap.get(id) || this.defaultTexName;
    if (name) {
      return this.texNameMap.get(name) || null;
    }
    return null;
  }

  getTextureByName(frame: string): THREE.Texture {
    return this.texNameMap.get(frame) || this.texNameMap.get(this.defaultTexName) || null;
  }

  getRandomTexture(): THREE.Texture {
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
