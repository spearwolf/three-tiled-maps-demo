import { TiledMapLayerChunk } from './TiledMapLayerChunk';

interface IChunkQuadTreeChildNodes {
    [index: string]: ChunkQuadTreeNode;
}

function addNode({ treeChildNodes }: { treeChildNodes: IChunkQuadTreeChildNodes }, quadrant: string, chunk: TiledMapLayerChunk) {
  const node = treeChildNodes[quadrant];
  if (node) {
    node.add(chunk);
  } else {
    treeChildNodes[quadrant] = new ChunkQuadTreeNode(chunk);
  }
}

export class ChunkQuadTreeNode {
  public chunkNodes: TiledMapLayerChunk[];

  public top?: number = null;
  public left?: number = null;

  public readonly treeChildNodes: IChunkQuadTreeChildNodes = {
    NorthEast: null,
    NorthWest: null,
    SouthEast: null,
    SouthWest: null,
  };

  constructor(chunks?: TiledMapLayerChunk|TiledMapLayerChunk[]) {
    this.chunkNodes = chunks ? [].concat(chunks) : [];
  }

  get isLeaf(): boolean {
    return this.left === null;
  }

  public toJson(): object {
    return {
      chunks: this.chunkNodes.map(({ left, top, right, bottom, width, height, data }) => ({
        bottom,
        height,
        left,
        right,
        top,
        width,
        data,
      })),
      isLeaf: this.isLeaf,
      left: this.left,
      northEast: this.treeChildNodes.NorthEast && this.treeChildNodes.NorthEast.toJson(),
      northWest: this.treeChildNodes.NorthWest && this.treeChildNodes.NorthWest.toJson(),
      southEast: this.treeChildNodes.SouthEast && this.treeChildNodes.SouthEast.toJson(),
      southWest: this.treeChildNodes.SouthWest && this.treeChildNodes.SouthWest.toJson(),
      top: this.top,
    };
  }

  public subdivide(maxChunkNodes: number) {
    if (this.isLeaf) {
      if (this.chunkNodes.length > maxChunkNodes) {
        // TODO find best x/y split axis
        const chunks = this.chunkNodes.sort((a, b) => a.left - b.left);
        this.chunkNodes = [];
        const leftNode = chunks[Math.floor(chunks.length / 2)];
        this.left = leftNode.left;
        chunks.sort((a, b) => a.top - b.top);
        const topNode = chunks[Math.floor(chunks.length / 2)];
        this.top = topNode.top;
        chunks.forEach((chunk) => this.add(chunk));
        if (this.treeChildNodes.NorthEast) {
          this.treeChildNodes.NorthEast.subdivide(maxChunkNodes);
        }
        if (this.treeChildNodes.NorthWest) {
          this.treeChildNodes.NorthWest.subdivide(maxChunkNodes);
        }
        if (this.treeChildNodes.SouthEast) {
          this.treeChildNodes.SouthEast.subdivide(maxChunkNodes);
        }
        if (this.treeChildNodes.SouthWest) {
          this.treeChildNodes.SouthWest.subdivide(maxChunkNodes);
        }
      }
    }
  }

  public add(chunk: TiledMapLayerChunk) {
    if (this.isLeaf) {
      this.chunkNodes.push(chunk);
      return;
    }
    const { top, left } = this;
    if (chunk.left >= left) {
      if (chunk.top <= top) {
        addNode(this, 'SouthEast', chunk);
      } else if (chunk.bottom >= top) {
        addNode(this, 'NorthEast', chunk);
      } else {
        this.chunkNodes.push(chunk);
      }
    } else if (chunk.right <= left) {
      if (chunk.top <= top) {
        addNode(this, 'SouthWest', chunk);
      } else if (chunk.bottom >= top) {
        addNode(this, 'NorthWest', chunk);
      } else {
        this.chunkNodes.push(chunk);
      }
    } else {
      this.chunkNodes.push(chunk);
    }
  }

  public findChunksAt(x: number, y: number): TiledMapLayerChunk[] {
    const chunks: TiledMapLayerChunk[] = this.chunkNodes.filter((chunk: TiledMapLayerChunk) => chunk.containsTileIdAt(x, y));
    let moreChunks: TiledMapLayerChunk[] = null;
    if (x < this.left) {
      if (y > this.top) {
        moreChunks = this.treeChildNodes.NorthWest.findChunksAt(x, y);
      } else {
        moreChunks = this.treeChildNodes.SouthWest.findChunksAt(x, y);
      }
    } else {
      if (y > this.top) {
        moreChunks = this.treeChildNodes.NorthEast.findChunksAt(x, y);
      } else {
        moreChunks = this.treeChildNodes.SouthEast.findChunksAt(x, y);
      }
    }
    return chunks.concat(moreChunks);
  }
}
