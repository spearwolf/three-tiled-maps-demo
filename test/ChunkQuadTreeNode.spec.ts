import { expect } from 'chai';

import { ChunkQuadTreeNode } from '../src/tiledmap/ChunkQuadTreeNode';
import { TiledMapLayerChunk } from '../src/tiledmap/TiledMapLayerChunk';

describe('ChunkQuadTreeNode', () => {
  describe('create without children', () => {
    const node = new ChunkQuadTreeNode();

    it('is instance of ChunkQuadTreeNode', () => expect(node).to.be.instanceOf(ChunkQuadTreeNode));
    it('is a leaf', () => expect(node.isLeaf).to.be.true);
    it('has no chunk nodes', () => expect(node.chunkNodes).to.be.empty);
  });

  describe('create', () => {
    const node = new ChunkQuadTreeNode([
      new TiledMapLayerChunk({ x: 0, y: 0, width: 8, height: 8, data: 'xxx' }),
      new TiledMapLayerChunk({ x: 8, y: 0, width: 8, height: 8, data: 'xxx' }),
      new TiledMapLayerChunk({ x: -8, y: -8, width: 8, height: 8, data: 'xxx' }),
      new TiledMapLayerChunk({ x: 16, y: 8, width: 8, height: 8, data: 'xxx' }),
      new TiledMapLayerChunk({ x: -4, y: -4, width: 16, height: 16, data: 'xxx' }),
    ]);

    it('is instance of ChunkQuadTreeNode', () => expect(node).to.be.instanceOf(ChunkQuadTreeNode));
    it('is a leaf', () => expect(node.isLeaf).to.be.true);
    it('has chunk nodes', () => expect(node.chunkNodes).to.lengthOf(5));
  });
});
