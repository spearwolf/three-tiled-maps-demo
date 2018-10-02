import { TiledMapLayerChunk } from './TiledMapLayerChunk';

interface IChunkQuadTreeChildNodes {
    [index: string]: ChunkQuadTreeNode;
}

interface IChunkAxis {
  origin: number;
  distance: number;
  noSubdivide: boolean;
}

const INTERSECT_DISTANCE_FACTOR = Math.PI;
const BEFORE_AFTER_DELTA_FACTOR = Math.PI;

const addNode = ({ nodes }: { nodes: IChunkQuadTreeChildNodes }, quadrant: string, chunk: TiledMapLayerChunk) => {
  const node = nodes[quadrant];
  if (node) {
    node.appendChunk(chunk);
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
    distance: beforeDistance + intersectDistance + afterDistance + (Math.abs(afterDistance - beforeDistance) * BEFORE_AFTER_DELTA_FACTOR),
    noSubdivide: (beforeCount === 0 && intersectCount === 0) ||
      (beforeCount === 0 && afterCount === 0) ||
      (intersectCount === 0 && afterCount === 0),
    origin,
  };
};

const findAxis = (chunks: TiledMapLayerChunk[], beforeProp: string, afterProp: string): IChunkAxis => {
  chunks.sort((a: any, b: any) => a[beforeProp] as number - b[beforeProp] as number);
  return (
    chunks
      .map(calcAxis.bind(null, chunks, beforeProp, afterProp))
      .filter((axis: IChunkAxis) => !axis.noSubdivide)
      .sort((a: IChunkAxis, b: IChunkAxis) => a.distance - b.distance)
  )[0] as IChunkAxis;
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

  public subdivide(maxChunkNodes: number = 2): void {
    if (this.isLeaf && this.chunks.length > 1 && this.chunks.length > maxChunkNodes) {
      const chunks = this.chunks.slice(0);
      const xAxis = findAxis(chunks, 'right', 'left');
      const yAxis = findAxis(chunks, 'bottom', 'top');

      if (xAxis && yAxis) {
        this.originX = xAxis.origin;
        this.originY = yAxis.origin;
        this.isLeaf = false;

        this.chunks.length = 0;
        chunks.forEach((chunk) => this.appendChunk(chunk));

        if (this.nodes.NorthEast) { this.nodes.NorthEast.subdivide(maxChunkNodes); }
        if (this.nodes.NorthWest) { this.nodes.NorthWest.subdivide(maxChunkNodes); }
        if (this.nodes.SouthEast) { this.nodes.SouthEast.subdivide(maxChunkNodes); }
        if (this.nodes.SouthWest) { this.nodes.SouthWest.subdivide(maxChunkNodes); }
      }
    }
  }

  public appendChunk(chunk: TiledMapLayerChunk) {
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

  public findChunksContained(left: number, top: number, width: number, height: number) {
    const right = left + width;
    const bottom = top + height;
    const { originX, originY } = this;
    let chunks = this.chunks.filter((chunk) => chunk.intersects(left, top, width, height));
    const { NorthWest } = this.nodes;
    if (NorthWest && (right <= originX || left <= originX) && (top <= originY || bottom <= originY)) {
      chunks = chunks.concat(NorthWest.findChunksContained(left, top, width, height));
    }
    const { NorthEast } = this.nodes;
    if (NorthEast && (right >= originX || left >= originX) && (top <= originY || bottom <= originY)) {
      chunks = chunks.concat(NorthEast.findChunksContained(left, top, width, height));
    }
    const { SouthEast } = this.nodes;
    if (SouthEast && (right >= originX || left >= originX) && (top >= originY || bottom >= originY)) {
      chunks = chunks.concat(SouthEast.findChunksContained(left, top, width, height));
    }
    const { SouthWest } = this.nodes;
    if (SouthWest && (right <= originX || left <= originX) && (top >= originY || bottom >= originY)) {
      chunks = chunks.concat(SouthWest.findChunksContained(left, top, width, height));
    }
    return chunks;
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
    if (this.nodes.NorthEast) { out.NorthEast = this.nodes.NorthEast.toDebugJson(); }
    if (this.nodes.NorthWest) { out.NorthWest = this.nodes.NorthWest.toDebugJson(); }
    if (this.nodes.SouthEast) { out.SouthEast = this.nodes.SouthEast.toDebugJson(); }
    if (this.nodes.SouthWest) { out.SouthWest = this.nodes.SouthWest.toDebugJson(); }
    return out;
  }
}
