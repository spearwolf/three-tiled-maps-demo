import { ChunkQuadTreeNode } from '../ChunkQuadTreeNode';
import { TiledMapLayerChunk } from '../TiledMapLayerChunk';

const chunkNodeNames = (chunkNodes: TiledMapLayerChunk[]) => chunkNodes.map((chunkNode: TiledMapLayerChunk) => chunkNode.rawData).sort();

describe('ChunkQuadTreeNode', () => {
  describe('create without children', () => {
    const node = new ChunkQuadTreeNode();

    it('is instance of ChunkQuadTreeNode', () => expect(node).toBeInstanceOf(ChunkQuadTreeNode));
    it('is a leaf', () => expect(node.isLeaf).toBeTruthy());
    it('has no chunk nodes', () => expect(node.chunks).toHaveLength(0));
  });

  describe('create with irregular chunks', () => {
    const chunks = {
      A: new TiledMapLayerChunk({ x: -10, y: -10, width:  5, height:  5, data: 'A' }),
      B: new TiledMapLayerChunk({ x:  -5, y: -10, width:  5, height:  5, data: 'B' }),
      C: new TiledMapLayerChunk({ x:   0, y: -10, width:  5, height:  5, data: 'C' }),
      D: new TiledMapLayerChunk({ x:   5, y: -10, width:  5, height:  5, data: 'D' }),
      E: new TiledMapLayerChunk({ x: -10, y:  -5, width:  5, height:  5, data: 'E' }),
      F: new TiledMapLayerChunk({ x:  -5, y:  -5, width:  5, height:  5, data: 'F' }),
      G: new TiledMapLayerChunk({ x:   0, y:  -5, width:  5, height:  5, data: 'G' }),
      H: new TiledMapLayerChunk({ x:   5, y:  -5, width:  5, height:  5, data: 'H' }),
      I: new TiledMapLayerChunk({ x: -10, y:   0, width:  5, height:  5, data: 'I' }),
      J: new TiledMapLayerChunk({ x:  -5, y:   0, width:  5, height:  5, data: 'J' }),
      K: new TiledMapLayerChunk({ x:   0, y:   0, width:  5, height:  5, data: 'K' }),
      L: new TiledMapLayerChunk({ x:   5, y:   0, width:  5, height:  5, data: 'L' }),
      M: new TiledMapLayerChunk({ x: -10, y:   5, width:  5, height:  5, data: 'M' }),
      N: new TiledMapLayerChunk({ x:  -5, y:   5, width:  5, height:  5, data: 'N' }),
      O: new TiledMapLayerChunk({ x:   0, y:   5, width:  5, height:  5, data: 'O' }),
      P: new TiledMapLayerChunk({ x:   5, y:   5, width:  5, height:  5, data: 'P' }),
      Q: new TiledMapLayerChunk({ x:  -7, y:  -7, width: 10, height:  4, data: 'Q' }),
      R: new TiledMapLayerChunk({ x:   0, y:  -9, width:  7, height:  3, data: 'R' }),
      S: new TiledMapLayerChunk({ x:   4, y:  -6, width:  6, height:  4, data: 'S' }),
      T: new TiledMapLayerChunk({ x:  -8, y:  -2, width:  3, height:  5, data: 'T' }),
      U: new TiledMapLayerChunk({ x:  -2, y:  -2, width:  5, height:  5, data: 'U' }),
      V: new TiledMapLayerChunk({ x:   5, y:  -1, width:  5, height:  3, data: 'V' }),
      W: new TiledMapLayerChunk({ x:  -8, y:   4, width:  6, height:  4, data: 'W' }),
      X: new TiledMapLayerChunk({ x:  -1, y:   5, width:  3, height:  5, data: 'X' }),
      Y: new TiledMapLayerChunk({ x:   2, y:   4, width:  6, height:  4, data: 'Y' }),
    };
    const node = new ChunkQuadTreeNode(Object.values(chunks));

    it('is instance of ChunkQuadTreeNode', () => expect(node).toBeInstanceOf(ChunkQuadTreeNode));
    it('is a leaf', () => expect(node.isLeaf).toBeTruthy());
    it('has chunk nodes', () => expect(node.chunks).toHaveLength(25));

    it('chunk->B->containsTileIdAt(5, 6)', () => expect(chunks.B.containsTileIdAt(-5, -10)).toBeTruthy());
    it('chunk->B->containsTileIdAt(5, 9)', () => expect(chunks.B.containsTileIdAt(0, -10)).toBeFalsy());
    it('chunk->B->containsTileIdAt(5, 6)', () => expect(chunks.B.containsTileIdAt(-2, -6)).toBeTruthy());
    it('chunk->B->containsTileIdAt(5, 9)', () => expect(chunks.B.containsTileIdAt(-6, -6)).toBeFalsy());

    it('subdivide()', () => {
      node.subdivide();
      //console.log('QuadTree', JSON.stringify(node.toDebugJson(), null, 2));
    });

    it('root is NOT a leaf', () => {
      expect(node.isLeaf).toBeFalsy();
    });

    it('root origin is (0, 0)', () => {
      expect(node.originX).toEqual(0);
      expect(node.originY).toEqual(0);
    });

    it('root has chunkNodes: [Q, T, U, V, X]', () => {
      expect(chunkNodeNames(node.chunks)).toEqual(['Q', 'T', 'U', 'V', 'X'].sort());
    });
  });

  describe('create with grid aligned chunks', () => {
    const chunks = {
      A: new TiledMapLayerChunk({ x: -10, y: -10, width:  5, height:  5, data: 'A' }),
      B: new TiledMapLayerChunk({ x:  -5, y: -10, width:  5, height:  5, data: 'B' }),
      C: new TiledMapLayerChunk({ x:   0, y: -10, width:  5, height:  5, data: 'C' }),
      D: new TiledMapLayerChunk({ x:   5, y: -10, width:  5, height:  5, data: 'D' }),
      E: new TiledMapLayerChunk({ x: -10, y:  -5, width:  5, height:  5, data: 'E' }),
      F: new TiledMapLayerChunk({ x:  -5, y:  -5, width:  5, height:  5, data: 'F' }),
      G: new TiledMapLayerChunk({ x:   0, y:  -5, width:  5, height:  5, data: 'G' }),
      H: new TiledMapLayerChunk({ x:   5, y:  -5, width:  5, height:  5, data: 'H' }),
      I: new TiledMapLayerChunk({ x: -10, y:   0, width:  5, height:  5, data: 'I' }),
      J: new TiledMapLayerChunk({ x:  -5, y:   0, width:  5, height:  5, data: 'J' }),
      K: new TiledMapLayerChunk({ x:   0, y:   0, width:  5, height:  5, data: 'K' }),
      L: new TiledMapLayerChunk({ x:   5, y:   0, width:  5, height:  5, data: 'L' }),
      M: new TiledMapLayerChunk({ x: -10, y:   5, width:  5, height:  5, data: 'M' }),
      N: new TiledMapLayerChunk({ x:  -5, y:   5, width:  5, height:  5, data: 'N' }),
      O: new TiledMapLayerChunk({ x:   0, y:   5, width:  5, height:  5, data: 'O' }),
      P: new TiledMapLayerChunk({ x:   5, y:   5, width:  5, height:  5, data: 'P' }),
    };
    const node = new ChunkQuadTreeNode(Object.values(chunks));

    it('has chunk nodes', () => expect(node.chunks).toHaveLength(16));

    it('subdivide()', () => {
      node.subdivide();
      //console.log('QuadTree', JSON.stringify(node.toDebugJson(), null, 2));
    });

    it('root is NOT a leaf', () => {
      expect(node.isLeaf).toBeFalsy();
    });

    it('root origin is (0, 0)', () => {
      expect(node.originX).toEqual(0);
      expect(node.originY).toEqual(0);
    });

    it('root has no [cross-axis] chunkNodes!', () => {
      expect(node.chunks).toHaveLength(0);
    });

    it('find chunks contained: (2, 4)[6, 4]', () => {
      const chunks = node.findChunksContained(2, 4, 6, 4);
      expect(chunkNodeNames(chunks)).toEqual(['K', 'L', 'O', 'P'].sort());
    });

    it('find chunks contained: (-2, -2)[5, 5]', () => {
      const chunks = node.findChunksContained(-2, -2, 5, 5);
      expect(chunkNodeNames(chunks)).toEqual(['F', 'G', 'J', 'K'].sort());
    });

    it('find chunks contained: (-9, -8)[2, 2]', () => {
      const chunks = node.findChunksContained(-9, -8, 2, 2);
      expect(chunkNodeNames(chunks)).toEqual(['A'].sort());
    });

    it('find chunks contained: (-20, -20)[2, 2]', () => {
      const chunks = node.findChunksContained(-20, -20, 2, 2);
      expect(chunks).toHaveLength(0);
    });
  });
});
