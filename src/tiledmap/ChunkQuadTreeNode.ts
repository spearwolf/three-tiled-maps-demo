import { TiledMapLayerChunk } from './TiledMapLayerChunk';

interface IChunkQuadTreeChildNodes {
    [index: string]: ChunkQuadTreeNode;
}

interface IChunkAxis {
  origin: number,
  distance: number,
  noSubdivide: boolean,
}

const INTERSECT_DISTANCE_FACTOR = Math.PI;

const addNode = ({ nodes }: { nodes: IChunkQuadTreeChildNodes }, quadrant: string, chunk: TiledMapLayerChunk) => {
  const node = nodes[quadrant];
  if (node) {
    node.add(chunk);
  } else {
    nodes[quadrant] = new ChunkQuadTreeNode(chunk);
  }
};

const calcAxis = (chunks: TiledMapLayerChunk[], beforeProp: string, afterProp: string, chunk: TiledMapLayerChunk): IChunkAxis => {
  const chunksCount = chunks.length;
  const origin = (chunk as any)[beforeProp] as number;
  const beforeChunks: TiledMapLayerChunk[] = [];
  const intersectChunks: TiledMapLayerChunk[] = [];
  const afterChunks: TiledMapLayerChunk[] = [];

  for (let i = 0; i < chunksCount; i++) {
    const beforeValue = (chunks[i] as any)[beforeProp] as number;
    if (beforeValue <= origin) {
      beforeChunks.push(chunk);
    } else {
      const afterValue = (chunks[i] as any)[afterProp] as number;
      if (afterValue >= origin) {
        afterChunks.push(chunk);
      } else {
        intersectChunks.push(chunk);
      }
    }
  }

  const beforeCount = beforeChunks.length;
  const intersectCount = intersectChunks.length;
  const afterCount = afterChunks.length;
  const beforeDistance = Math.abs(0.5 - (beforeCount / chunksCount));
  const intersectDistance = Math.abs(intersectCount / chunksCount) * INTERSECT_DISTANCE_FACTOR;
  const afterDistance = Math.abs(0.5 - (afterCount / chunksCount));

  return {
    origin,
    distance: beforeDistance + intersectDistance + afterDistance,
    noSubdivide: (beforeCount === 0 && intersectCount === 0) ||
      (beforeCount === 0 && afterCount === 0) ||
      (intersectCount === 0 && afterCount === 0),
  };
};

const findAxis = (chunks: TiledMapLayerChunk[], beforeProp: string, afterProp: string): IChunkAxis => {
  chunks.sort((a: any, b: any) => a[beforeProp] as number - b[beforeProp] as number);
  return <IChunkAxis>(
    chunks
      .map(calcAxis.bind(null, chunks, beforeProp, afterProp))
      .filter((axis: IChunkAxis) => !axis.noSubdivide)
      .sort((a: IChunkAxis, b: IChunkAxis) => a.distance - b.distance)
  )[0];
};

export class ChunkQuadTreeNode {
  public originX: number = null;
  public originY: number = null;

  public chunks: TiledMapLayerChunk[];

  public isLeaf = true;

  public readonly nodes: IChunkQuadTreeChildNodes = {
    NorthEast: null,
    NorthWest: null,
    SouthEast: null,
    SouthWest: null,
  };

  /**
   * use a right(x) / down(y) coordinate system
   */
  constructor(chunks?: TiledMapLayerChunk|TiledMapLayerChunk[]) {
    this.chunks = chunks ? [].concat(chunks) : [];
  }

  public subdivide(maxChunkNodes: number = 1): void {
    if (this.isLeaf && this.chunks.length > 1 && this.chunks.length > maxChunkNodes) {
      const chunks = this.chunks.slice(0);
      const xAxis = findAxis(chunks, 'right', 'left');
      const yAxis = findAxis(chunks, 'top', 'bottom');

      if (xAxis && yAxis) {
        this.originX = xAxis.origin;
        this.originY = yAxis.origin;
        this.isLeaf = false;

        this.chunks.length = 0;
        chunks.forEach((chunk) => this.add(chunk));

        if (this.nodes.NorthEast) this.nodes.NorthEast.subdivide(maxChunkNodes);
        if (this.nodes.NorthWest) this.nodes.NorthWest.subdivide(maxChunkNodes);
        if (this.nodes.SouthEast) this.nodes.SouthEast.subdivide(maxChunkNodes);
        if (this.nodes.SouthWest) this.nodes.SouthWest.subdivide(maxChunkNodes);
      }
    }
  }

  public add(chunk: TiledMapLayerChunk) {
    if (this.isLeaf) {
      this.chunks.push(chunk);
      return;
    }
    const { originY, originX } = this;
    if (chunk.left >= originX) {
      if (chunk.top >= originY) {
        addNode(this, 'SouthEast', chunk);
      } else if (chunk.bottom <= originY) {
        addNode(this, 'NorthEast', chunk);
      } else {
        this.chunks.push(chunk);
      }
    } else if (chunk.right <= originX) {
      if (chunk.top >= originY) {
        addNode(this, 'SouthWest', chunk);
      } else if (chunk.bottom <= originY) {
        addNode(this, 'NorthWest', chunk);
      } else {
        this.chunks.push(chunk);
      }
    } else {
      this.chunks.push(chunk);
    }
  }

  public findChunksAt(x: number, y: number): TiledMapLayerChunk[] {
    const chunks: TiledMapLayerChunk[] = this.chunks.filter((chunk: TiledMapLayerChunk) => chunk.containsTileIdAt(x, y));
    let moreChunks: TiledMapLayerChunk[] = null;
    if (x < this.originX) {
      if (y < this.originY) {
        moreChunks = this.nodes.NorthWest.findChunksAt(x, y);
      } else {
        moreChunks = this.nodes.SouthWest.findChunksAt(x, y);
      }
    } else {
      if (y < this.originY) {
        moreChunks = this.nodes.NorthEast.findChunksAt(x, y);
      } else {
        moreChunks = this.nodes.SouthEast.findChunksAt(x, y);
      }
    }
    return chunks.concat(moreChunks);
  }

  public toDebugJson(): object|string {
    if (this.isLeaf) {
      return this.chunks.map((chunk) => chunk.rawData).join(', ');
    }
    const out: any = {
      _originX: this.originX,
      _originY: this.originY,
    };
    if (this.chunks.length) {
      out._chunks = this.chunks.map((chunk) => chunk.rawData).join(', ');
    }
    if (this.nodes.NorthEast) out.NorthEast = this.nodes.NorthEast.toDebugJson();
    if (this.nodes.NorthWest) out.NorthWest = this.nodes.NorthWest.toDebugJson();
    if (this.nodes.SouthEast) out.SouthEast = this.nodes.SouthEast.toDebugJson();
    if (this.nodes.SouthWest) out.SouthWest = this.nodes.SouthWest.toDebugJson();
    return out;
  }
}
