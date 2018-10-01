import { ChunkQuadTreeNode } from '../ChunkQuadTreeNode';
import { TiledMapLayerChunk } from '../TiledMapLayerChunk';

describe('ChunkQuadTreeNode', () => {
  describe('create without children', () => {
    const node = new ChunkQuadTreeNode();

    it('is instance of ChunkQuadTreeNode', () => expect(node).toBeInstanceOf(ChunkQuadTreeNode));
    it('is a leaf', () => expect(node.isLeaf).toBeTruthy());
    it('has no chunk nodes', () => expect(node.chunkNodes).toHaveLength(0));
  });

  describe('create', () => {
    const chunks = {
      a: new TiledMapLayerChunk({ x: -9, y: 9, width: 4, height: 4, data: 'A' }),
      b: new TiledMapLayerChunk({ x: 4, y: 8, width: 4, height: 4, data: 'B' }),
      c: new TiledMapLayerChunk({ x: -9, y: 3, width: 7, height: 5, data: 'C' }),
      d: new TiledMapLayerChunk({ x: -5, y: 4, width: 9, height: 8, data: 'D' }),
      e: new TiledMapLayerChunk({ x: -3, y: -5, width: 6, height: 4, data: 'E' }),
      f: new TiledMapLayerChunk({ x: 1, y: -4, width: 6, height: 4, data: 'F' }),
    };
    const node = new ChunkQuadTreeNode(Object.values(chunks));

    it('is instance of ChunkQuadTreeNode', () => expect(node).toBeInstanceOf(ChunkQuadTreeNode));
    it('is a leaf', () => expect(node.isLeaf).toBeTruthy());
    it('has chunk nodes', () => expect(node.chunkNodes).toHaveLength(6));

    it('subdivide', () => {
      node.subdivide(2);
      // console.log('QuadTree', JSON.stringify(node.toJson(), null, 2));
      expect(node.isLeaf).toBeFalsy();
    });

    it('chunk->B->containsTileIdAt(5, 6)', () => expect(chunks.b.containsTileIdAt(5, 6)).toBeTruthy());
    it('chunk->B->containsTileIdAt(5, 9)', () => expect(chunks.b.containsTileIdAt(5, 9)).toBeFalsy());
  });
});
