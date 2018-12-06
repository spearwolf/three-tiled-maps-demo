import { ITextureAtlasData } from './ITextureAtlasData';
import { PowerOf2Image } from './PowerOf2Image';
import { Texture } from './Texture';

function sample<T>(arr: T[]): T {
  return arr[(Math.random() * arr.length) | 0];
}

export class TextureAtlas {

  static async load(path: string, basePath: string = './'): Promise<TextureAtlas> {
    const atlas = await fetch(`${basePath}${path}`).then((response) => response.json()) as ITextureAtlasData;
    const baseTexture = new Texture(await new PowerOf2Image(`${basePath}${atlas.meta.image}`).onLoaded);
    return new TextureAtlas(baseTexture, atlas);
  }

  private frames = new Map<string, Texture>();

  constructor(readonly baseTexture: Texture, data: ITextureAtlasData) {
    Object.keys(data.frames).forEach((name: string) => {
      const { frame } = data.frames[name];
      this.addFrame(name, frame.w, frame.h, frame.x, frame.y);
    });
  }

  addFrame(name: string, width: number, height: number, x: number, y: number) {
    this.frames.set(name, new Texture(this.baseTexture, width, height, x, y));
  }

  frame(name: string) {
    return this.frames.get(name);
  }

  randomFrame() {
    return sample(Array.from(this.frames.values()));
  }

  frameNames(match?: string | RegExp): string[] {
    const frames = Array.from(this.frames.keys());
    if (match) {
      const regex = typeof match === 'string' ? new RegExp(match) : match;
      return frames.filter((name) => regex.test(name));
    }
    return frames;
  }

  randomFrameName() {
    return sample(this.frameNames());
  }
}
