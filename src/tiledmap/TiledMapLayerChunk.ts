// import { AABB2 } from './AABB2';
import { base64toUint32Arr } from './base64toUint32Arr';
import { ITiledMapLayerChunkData } from './ITiledMapLayerChunkData';

export class TiledMapLayerChunk {
  private readonly data: ITiledMapLayerChunkData;
  private cachedUint32Array: Uint32Array = null;

  // readonly aabb: AABB2;

  constructor(data: ITiledMapLayerChunkData) {
    this.data = data;
    // this.aabb = new AABB2(data.x, data.y, data.width, data.height);
  }

  get rawData(): string {
    return this.data.data;
  }

  get uint32Arr(): Uint32Array {
    if (this.cachedUint32Array === null) {
      this.cachedUint32Array = base64toUint32Arr(this.rawData);
    }
    return this.cachedUint32Array;
  }

  get left(): number { return this.data.x; }
  get top(): number { return this.data.y; }
  get right(): number { return this.data.x + this.data.width; }
  get bottom(): number { return this.data.y + this.data.height; }
  get width(): number { return this.data.width; }
  get height(): number { return this.data.height; }
  // get left(): number { return this.aabb.left; }
  // get top(): number { return this.aabb.top; }
  // get right(): number { return this.aabb.right; }
  // get bottom(): number { return this.aabb.bottom; }

  getLocalTileIdAt(x: number, y: number): number {
    return this.uint32Arr[y * this.data.width + x];
  }

  getTileIdAt(x: number, y: number): number {
    return this.getLocalTileIdAt(x - this.left, y - this.top);
  }

  containsTileIdAt(x: number, y: number): boolean {
    return this.left <= x && x < this.right && this.top <= y && y < this.bottom;
    // return this.aabb.isInside(x, y);
  }

  isIntersecting(left: number, top: number, width: number, height: number): boolean {
    const right = left + width;
    const bottom = top + height;
    return !(
      right <= this.left ||
      left >= this.right ||
      bottom <= this.top ||
      top >= this.bottom
    );
  }
  // isIntersecting(aabb: AABB2): boolean {
  //   return this.aabb.isIntersecting(aabb);
  // }
}
