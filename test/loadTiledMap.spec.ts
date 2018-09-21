import { expect } from 'chai';

import { TiledMap } from '../src/tiledmap/TiledMap';
import { TiledMapLayer } from '../src/tiledmap/TiledMapLayer';

import { A_FIRST_MAP } from './tiledmaps';

describe('loadTiledMap', () => {
  describe('180917-a-first-map.json', () => {
    let tm: TiledMap = null;

    it('new TiledMap', () => {
      tm = new TiledMap(A_FIRST_MAP);
      expect(tm).to.be.instanceOf(TiledMap);
    });

    it('has "main" layer', () => {
      const layer = tm.layers.get('main');
      expect(layer).to.be.instanceOf(TiledMapLayer);
      expect(layer.name).to.be.equal('main');
    });
  });
});
