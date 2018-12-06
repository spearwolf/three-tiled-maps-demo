import { ImageSource, PowerOf2Image } from './PowerOf2Image';

export type TextureImage = PowerOf2Image | ImageSource;
export type TextureSource = Texture | TextureImage;

export class Texture {

  static async load(url: string) {
    return new Texture(await new PowerOf2Image(url).onLoaded);
  }

  image: TextureImage;
  parent: Texture;

  x: number;
  y: number;

  private _width: number;
  private _height: number;

  constructor(source: TextureSource, width?: number, height?: number, x: number = 0, y: number = 0) {
    let w = width;
    let h = height;

    if (source instanceof Texture) {
      this.parent = source;
      this.image = null;
    } else if (typeof source === 'object' && 'width' in source && 'height' in source) {
      this.image = source;
      this.parent = null;
      if ('origWidth' in source && 'origHeight' in source) {
        w = source.origWidth;
        h = source.origHeight;
      }
    } else {
      throw new Error(`Texture() constructor panic: unexpected parameter {source: ${source}}`);
    }

    this._width = w;
    this._height = h;

    this.x = x;
    this.y = y;
  }

  get root(): Texture {
    return (this.parent && this.parent.root) || this;
  }

  get imgEl(): ImageSource {
    const { root } = this;
    if (root.image instanceof PowerOf2Image) {
      return root.image.imgEl;
    }
    return root.image;
  }

  get width(): number {
    return (typeof this._width === 'number'
      ? this._width
      : (this.image
        ? this.image.width
        : (this.parent
          ? this.root.width
          : 0
        )
      )
    );
  }

  set width(w) {
    this._width = w;
  }

  get height(): number {
    return (typeof this._height === 'number'
      ? this._height
      : (this.image
        ? this.image.height
        : (this.parent
          ? this.root.height
          : 0
        )
      )
    );
  }

  set height(h) {
    this._height = h;
  }

  get minS() {
    let { x } = this;
    let texture: Texture = this;

    // tslint:disable-next-line:no-conditional-assignment
    while ((texture = texture.parent) != null) {
      x += texture.x;
    }

    return x / this.root.image.width;
  }

  get minT() {
    let { y } = this;
    let texture: Texture = this;

    // tslint:disable-next-line:no-conditional-assignment
    while ((texture = texture.parent) != null) {
      y += texture.y;
    }

    return y / this.root.image.height;
  }

  get maxS() {
    let x = this.x + this.width;
    let texture: Texture = this;

    // tslint:disable-next-line:no-conditional-assignment
    while ((texture = texture.parent) != null) {
      x += texture.x;
    }

    return x / this.root.image.width;
  }

  get maxT() {
    let y = this.y + this.height;
    let texture: Texture = this;

    // tslint:disable-next-line:no-conditional-assignment
    while ((texture = texture.parent) != null) {
      y += texture.y;
    }

    return y / this.root.image.height;
  }
}
