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
    const node = new ChunkQuadTreeNode([
      new TiledMapLayerChunk({ x: 0, y: 0, width: 8, height: 8, data: 'xxx' }),
      new TiledMapLayerChunk({ x: 8, y: 0, width: 8, height: 8, data: 'xxx' }),
      new TiledMapLayerChunk({ x: -8, y: -8, width: 8, height: 8, data: 'xxx' }),
      new TiledMapLayerChunk({ x: 16, y: 8, width: 8, height: 8, data: 'xxx' }),
      new TiledMapLayerChunk({ x: -4, y: -4, width: 16, height: 16, data: 'xxx' }),
    ]);

    it('is instance of ChunkQuadTreeNode', () => expect(node).toBeInstanceOf(ChunkQuadTreeNode));
    it('is a leaf', () => expect(node.isLeaf).toBeTruthy());
    it('has chunk nodes', () => expect(node.chunkNodes).toHaveLength(5));
    it('subdivide', () => {
      node.subdivide(2);
      console.log('QuadTree', JSON.stringify(node.toJson(), null, 2));
      expect(node.isLeaf).toBeFalsy();
    });
  });
});
