import { TiledMap } from '../tiledmap/TiledMap';
import { TiledMapLayer } from '../tiledmap/TiledMapLayer';

import {
  A_FIRST_MAP,
  A_FIRST_MAP_FINITE,
  A_FIRST_MAP_RIGHT_TOP,
} from './tiledmaps';

describe('loadTiledMap', () => {
  describe('1: 180917-a-first-map.json', () => {
    let tm: TiledMap = null;

    it('new TiledMap', () => {
      tm = new TiledMap(A_FIRST_MAP);
      expect(tm).toBeInstanceOf(TiledMap);
    });

    it('has "main" layer', () => {
      const layer = tm.getLayer('main');
      expect(layer).toBeInstanceOf(TiledMapLayer);
      expect(layer.name).toBe('main');
    });

    it('layer#main->getTileIdsAt(-1, -2, 4, 6)', () => {
      expect(Array.from(tm.getLayer('main').getTileIdsWithin(-1, -2, 4, 6))).toEqual([
        2, 2, 7, 1,
        13, 2, 7, 1,
        2, 2, 7, 1,
        2, 2, 7, 1,
        4, 4, 1, 1,
        1, 1, 1, 1,
      ]);
    });
  });

  describe('2: 181002-a-first-map-right-top.json', () => {
    let tm: TiledMap = null;

    it('new TiledMap', () => {
      tm = new TiledMap(A_FIRST_MAP_RIGHT_TOP);
      expect(tm).toBeInstanceOf(TiledMap);
    });

    it('has "main" layer', () => {
      const layer = tm.getLayer('main');
      expect(layer).toBeInstanceOf(TiledMapLayer);
      expect(layer.name).toBe('main');
    });

    it('layer#main->getTileIdsAt(-1, 0, 4, 6)', () => {
      expect(Array.from(tm.getLayer('main').getTileIdsWithin(-1, 0, 4, 6))).toEqual([
        2, 2, 7, 1,
        2, 2, 7, 1,
        4, 4, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
      ]);
    });

    it('layer#main->getTileIdsAt(unreachable)', () => {
      expect(Array.from(tm.getLayer('main').getTileIdsWithin(10000, 20000, 3, 2))).toEqual([
        0, 0, 0,
        0, 0, 0,
      ]);
    });
  });

  describe('3: 181002-a-first-map-finite.json', () => {
    let tm: TiledMap = null;

    it('new TiledMap throws an error', () => {
      expect(() => {
        tm = new TiledMap(A_FIRST_MAP_FINITE);
        expect(tm).toBeInstanceOf(TiledMap);
      }).toThrow();
    });
  });
});
