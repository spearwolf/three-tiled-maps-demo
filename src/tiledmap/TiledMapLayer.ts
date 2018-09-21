import { ITiledMapLayerChunkData } from './ITiledMapLayerChunkData';
import { ITiledMapLayerData } from './ITiledMapLayerData';
import { TiledMapLayerChunk } from './TiledMapLayerChunk';

export class TiledMapLayer {
  private readonly data: ITiledMapLayerData;
  private readonly chunks: TiledMapLayerChunk[];

  constructor(data: ITiledMapLayerData) {
    this.data = data;
    this.chunks = data.chunks.map((chunkData: ITiledMapLayerChunkData) => new TiledMapLayerChunk(chunkData));
  }

  get name(): string { return this.data.name; }

  public getGlobalTileIdsAt(left: number, top: number, width: number, height: number, uint32arr?: Uint32Array): Uint32Array {
    const arr = uint32arr || new Uint32Array(width * height);
    let curChunk: TiledMapLayerChunk = null;
    for (let offsetY = 0; offsetY < height; offsetY++) {
      for (let offsetX = 0; offsetX < width; offsetX++) {
        const x = left + offsetX;
        const y = top + offsetY;
        if (!curChunk || !curChunk.containsTileIdAt(x, y)) {
          curChunk = this.findChunk(x, y);
        }
        arr[offsetY * width + offsetX] = curChunk ? curChunk.getTileIdAt(x, y) : 0;
      }
    }
    return arr;
  }

  /**
   * use binary/quad-tree based chunk search here!
   */
  public findChunk(x: number, y: number): TiledMapLayerChunk {
    return this.chunks.find((chunk: TiledMapLayerChunk) => chunk.containsTileIdAt(x, y));
  }
}
