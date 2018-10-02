import { ChunkQuadTreeNode } from './ChunkQuadTreeNode';
import { ITiledMapLayerChunkData } from './ITiledMapLayerChunkData';
import { ITiledMapLayerData } from './ITiledMapLayerData';
import { TiledMapLayerChunk } from './TiledMapLayerChunk';

const findChunk = (chunks: TiledMapLayerChunk[], x: number, y: number): TiledMapLayerChunk => {
  return chunks.find((chunk: TiledMapLayerChunk) => chunk.containsTileIdAt(x, y));
};

export class TiledMapLayer {
  private readonly data: ITiledMapLayerData;
  private readonly rootNode: ChunkQuadTreeNode;

  constructor(data: ITiledMapLayerData, autoSubdivide: boolean = true) {
    this.data = data;
    const chunks: TiledMapLayerChunk[] = data.chunks.map((chunkData: ITiledMapLayerChunkData) => new TiledMapLayerChunk(chunkData));
    this.rootNode = new ChunkQuadTreeNode(chunks);
    if (autoSubdivide) {
      this.subdivide();
    }
  }

  get name(): string { return this.data.name; }

  public subdivide(maxChunkPerNodes: number = 2) {
    this.rootNode.subdivide(maxChunkPerNodes);
  }

  /**
   * use a right(x) / down(y) coordinate system
   */
  public getTileIdsAt(left: number, top: number, width: number, height: number, uint32arr?: Uint32Array): Uint32Array {
    const arr = uint32arr || new Uint32Array(width * height);
    const chunks = this.rootNode.findChunksContained(left, top, width, height);

    let curChunk: TiledMapLayerChunk = null;
    for (let offsetY = 0; offsetY < height; offsetY++) {
      for (let offsetX = 0; offsetX < width; offsetX++) {
        const x = left + offsetX;
        const y = top + offsetY;
        if (!curChunk || !curChunk.containsTileIdAt(x, y)) {
          curChunk = findChunk(chunks, x, y);
        }
        arr[offsetY * width + offsetX] = curChunk ? curChunk.getTileIdAt(x, y) : 0;
      }
    }
    return arr;
  }
}
