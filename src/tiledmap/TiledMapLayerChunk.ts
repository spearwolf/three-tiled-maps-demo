import { base64toUint32Arr } from './base64toUint32Arr';
import { ITiledMapLayerChunkData } from './ITiledMapLayerChunkData';

export class TiledMapLayerChunk {
  private readonly data: ITiledMapLayerChunkData;
  private cachedUint32Array: Uint32Array = null;

  constructor(data: ITiledMapLayerChunkData) {
    this.data = data;
  }

  get uint32Arr(): Uint32Array {
    if (this.cachedUint32Array === null) {
      this.cachedUint32Array = base64toUint32Arr(this.data.data);
    }
    return this.cachedUint32Array;
  }

  get left(): number { return this.data.x; }
  get top(): number { return this.data.y; }
  get right(): number { return this.data.x + this.data.width; }
  get bottom(): number { return this.data.y - this.data.height; }
  get width(): number { return this.data.width; }
  get height(): number { return this.data.height; }

  public getLocalTileIdAt(x: number, y: number): number {
    return this.uint32Arr[y * this.data.width + x];
  }

  public getTileIdAt(x: number, y: number): number {
    const { x: startx, y: starty } = this.data;
    return this.getLocalTileIdAt(x - startx, y - starty);
  }

  public containsTileIdAt(x: number, y: number): boolean {
    const { x: startx, y: starty, width, height } = this.data;
    return startx <= x && x < startx + width && starty <= y && y < starty + height;
  }
}
