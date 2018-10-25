import { AABB2 } from './AABB2';
import { TiledMapLayerChunk } from './TiledMapLayerChunk';

enum Quadrant {
  NorthEast = 'northEast',
  SouthEast = 'southEast',
  SouthWest = 'southWest',
  NorthWest = 'northWest',
}

type IChunkQuadTreeChildNodes = {
  [index in Quadrant]: ChunkQuadTreeNode;
};

interface IChunkAxis {
  origin: number;
  distance: number;
  noSubdivide: boolean;
}

const INTERSECT_DISTANCE_FACTOR = Math.PI;
const BEFORE_AFTER_DELTA_FACTOR = Math.PI;

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
  chunks.sort((a: any, b: any) => a[beforeProp] - b[beforeProp]);
  return (
    chunks
      .map(calcAxis.bind(null, chunks, beforeProp, afterProp))
      .filter((axis: IChunkAxis) => !axis.noSubdivide)
      .sort((a: IChunkAxis, b: IChunkAxis) => a.distance - b.distance)
  )[0] as IChunkAxis;
};

export class ChunkQuadTreeNode {
  originX: number = null;
  originY: number = null;

  chunks: TiledMapLayerChunk[];

  isLeaf = true;

  readonly nodes: IChunkQuadTreeChildNodes = {
    northEast: null,
    northWest: null,
    southEast: null,
    southWest: null,
  };

  /**
   * Uses a right-handed coordinate system
   */
  constructor(chunks?: TiledMapLayerChunk|TiledMapLayerChunk[]) {
    this.chunks = chunks ? [].concat(chunks) : [];
  }

  subdivide(maxChunkNodes: number = 2): void {
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

        this.subdivideNode(Quadrant.NorthEast, maxChunkNodes);
        this.subdivideNode(Quadrant.NorthWest, maxChunkNodes);
        this.subdivideNode(Quadrant.SouthEast, maxChunkNodes);
        this.subdivideNode(Quadrant.SouthWest, maxChunkNodes);
      }
    }
  }

  private subdivideNode(quadrant: Quadrant, maxChunkNodes: number) {
    const node = this.nodes[quadrant];
    if (node) {
      node.subdivide(maxChunkNodes);
    }
  }

  appendChunk(chunk: TiledMapLayerChunk) {
    if (this.isLeaf) {
      this.chunks.push(chunk);
      return;
    }
    const { originY, originX } = this;
    if (chunk.left >= originX) {
      if (chunk.top >= originY) {
        this.appendToNode(Quadrant.SouthEast, chunk);
      } else if (chunk.bottom <= originY) {
        this.appendToNode(Quadrant.NorthEast, chunk);
      } else {
        this.chunks.push(chunk);
      }
    } else if (chunk.right <= originX) {
      if (chunk.top >= originY) {
        this.appendToNode(Quadrant.SouthWest, chunk);
      } else if (chunk.bottom <= originY) {
        this.appendToNode(Quadrant.NorthWest, chunk);
      } else {
        this.chunks.push(chunk);
      }
    } else {
      this.chunks.push(chunk);
    }
  }

  private appendToNode(quadrant: Quadrant, chunk: TiledMapLayerChunk) {
    const node = this.nodes[quadrant];
    if (node) {
      node.appendChunk(chunk);
    } else {
      this.nodes[quadrant] = new ChunkQuadTreeNode(chunk);
    }
  }

  // tslint:disable-next-line:cognitive-complexity
  findVisibleChunks(aabb: AABB2) {
    const { originX, originY } = this;
    const { top, left, bottom, right } = aabb;

    let chunks = this.chunks.filter((chunk) => chunk.isIntersecting(aabb));

    const { northWest } = this.nodes;
    if (northWest && (right <= originX || left <= originX) && (top <= originY || bottom <= originY)) {
      chunks = chunks.concat(northWest.findVisibleChunks(aabb));
    }
    const { northEast } = this.nodes;
    if (northEast && (right >= originX || left >= originX) && (top <= originY || bottom <= originY)) {
      chunks = chunks.concat(northEast.findVisibleChunks(aabb));
    }
    const { southEast } = this.nodes;
    if (southEast && (right >= originX || left >= originX) && (top >= originY || bottom >= originY)) {
      chunks = chunks.concat(southEast.findVisibleChunks(aabb));
    }
    const { southWest } = this.nodes;
    if (southWest && (right <= originX || left <= originX) && (top >= originY || bottom >= originY)) {
      chunks = chunks.concat(southWest.findVisibleChunks(aabb));
    }

    return chunks;
  }

  findChunksAt(x: number, y: number): TiledMapLayerChunk[] {
    const chunks: TiledMapLayerChunk[] = this.chunks.filter((chunk: TiledMapLayerChunk) => chunk.containsTileIdAt(x, y));
    let moreChunks: TiledMapLayerChunk[] = null;
    if (x < this.originX) {
      if (y < this.originY) {
        moreChunks = this.nodes.northWest.findChunksAt(x, y);
      } else {
        moreChunks = this.nodes.southWest.findChunksAt(x, y);
      }
    } else {
      if (y < this.originY) {
        moreChunks = this.nodes.northEast.findChunksAt(x, y);
      } else {
        moreChunks = this.nodes.southEast.findChunksAt(x, y);
      }
    }
    return chunks.concat(moreChunks);
  }

  toDebugJson(): object|string {
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
    if (this.nodes.northEast) { out.NorthEast = this.nodes.northEast.toDebugJson(); }
    if (this.nodes.northWest) { out.NorthWest = this.nodes.northWest.toDebugJson(); }
    if (this.nodes.southEast) { out.SouthEast = this.nodes.southEast.toDebugJson(); }
    if (this.nodes.southWest) { out.SouthWest = this.nodes.southWest.toDebugJson(); }
    return out;
  }
}
