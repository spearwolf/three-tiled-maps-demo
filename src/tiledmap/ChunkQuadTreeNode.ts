import { TiledMapLayerChunk } from './TiledMapLayerChunk';

interface ITreeChildNodes {
    [index: string]: ChunkQuadTreeNode;
}

function addNode({ treeChildNodes }: { treeChildNodes: ITreeChildNodes }, quadrant: string, chunk: TiledMapLayerChunk) {
  const node = treeChildNodes[quadrant];
  if (node) {
    node.add(chunk);
  } else {
    treeChildNodes[quadrant] = new ChunkQuadTreeNode(chunk);
  }
}

export class ChunkQuadTreeNode {
  public readonly chunkNodes: TiledMapLayerChunk[];

  public top?: number = null;
  public left?: number = null;

  public readonly treeChildNodes: ITreeChildNodes = {
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

  public add(chunk: TiledMapLayerChunk) {
    if (this.isLeaf) {
      this.chunkNodes.push(chunk);
      return;
    }

    const { top, left } = this;
    if (chunk.left >= left) {
      if (chunk.top <= top) {
        addNode(this, 'SouthEast', chunk);
      } else if (chunk.bottom > top) {
        addNode(this, 'NorthEast', chunk);
      } else {
        this.chunkNodes.push(chunk);
      }
    } else if (chunk.right < left) {
      if (chunk.top <= top) {
        addNode(this, 'SouthWest', chunk);
      } else if (chunk.bottom > top) {
        addNode(this, 'NorthWest', chunk);
      } else {
        this.chunkNodes.push(chunk);
      }
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
