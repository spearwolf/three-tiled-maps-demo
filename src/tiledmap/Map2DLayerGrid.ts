import * as THREE from 'three';

import { IMap2DLayer } from './IMap2DLayer';
import { Map2DGridTile } from './Map2DGridTile';
import { Map2DView } from './Map2DView';

const takeFrom = (tiles: Map2DGridTile[], left: number, top: number): Map2DGridTile => {
  const idx = tiles.findIndex((gridTile) => gridTile.isGridTilePosition(left, top));
  if (idx !== -1) {
    return tiles.splice(idx, 1)[0];
  }
  return null;
};

/**
 * Represents a grid of *grid tiles* (see Map2DGridTile) for a specific layer.
 */
export class Map2DLayerGrid {
  readonly view: Map2DView;
  readonly layer: IMap2DLayer;

  readonly gridTileColumns: number;
  readonly gridTileRows: number;
  readonly gridTileWidth: number;
  readonly gridTileHeight: number;

  gridTiles: Map2DGridTile[] = [];

  constructor(view: Map2DView, layer: IMap2DLayer) {
    this.view = view;
    this.layer = layer;

    this.gridTileColumns = Math.ceil(view.gridTileWidth / layer.tileWidth);
    this.gridTileRows = Math.ceil(view.gridTileHeight / layer.tileHeight);
    this.gridTileWidth = this.gridTileColumns * layer.tileWidth;
    this.gridTileHeight = this.gridTileRows * layer.tileHeight;

    // tslint:disable-next-line:max-line-length
    console.log('gridTileColumns=', this.gridTileColumns, 'gridTileRows=', this.gridTileRows, 'gridTileWidth=', this.gridTileWidth, 'gridTileHeight=', this.gridTileHeight);
  }

  update() {
    // I. create visible map tiles (and remove/dispose unvisible)
    //
    const gridTileSize = new THREE.Vector2(this.gridTileWidth, this.gridTileHeight);
    const halfDimension = this.view.dimension.clone();
    halfDimension.multiplyScalar(0.5);

    const topLeft = this.view.origin.clone();
    topLeft.sub(halfDimension);
    topLeft.divide(gridTileSize);
    topLeft.set(Math.floor(topLeft.x), Math.floor(topLeft.y));

    const bottomRight = this.view.origin.clone();
    bottomRight.add(halfDimension);
    bottomRight.divide(gridTileSize);
    bottomRight.set(Math.floor(bottomRight.x), Math.floor(bottomRight.y));

    const sizes = bottomRight.clone();
    sizes.sub(topLeft);
    sizes.addScalar(1);

    console.log('[gridTiles] topLeft', topLeft.x, topLeft.y, 'bottomRight', bottomRight.x, bottomRight.y, 'sizes', sizes.x, sizes.y);
    // tslint:disable-next-line:max-line-length
    console.log('[tiles] topLeft', topLeft.x * this.gridTileColumns, topLeft.y * this.gridTileRows, 'bottomRight', bottomRight.x * this.gridTileColumns, bottomRight.y * this.gridTileRows, 'sizes', sizes.x * this.gridTileColumns, sizes.y * this.gridTileRows);
    // tslint:disable-next-line:max-line-length
    console.log('[pixels] topLeft', topLeft.x * this.gridTileWidth, topLeft.y * this.gridTileHeight, 'bottomRight', bottomRight.x * this.gridTileWidth, bottomRight.y * this.gridTileHeight, 'sizes', sizes.x * this.gridTileWidth, sizes.y * this.gridTileHeight);

    // II. create geometries for all *new* map tiles
    //
    const prevGridTiles = this.gridTiles.slice(0);
    const newTiles: Map2DGridTile[] = [];
    const knownTiles: Map2DGridTile[] = [];

    for (let yOffset = 0; yOffset < sizes.y; ++yOffset) {
      for (let xOffset = 0; xOffset < sizes.x; ++xOffset) {
        const x = topLeft.x + xOffset;
        const y = topLeft.y + yOffset;
        let tile = takeFrom(prevGridTiles, x, y);
        if (!tile) {
          // maybe re-use obsolete tiles?
          tile = new Map2DGridTile(this.layer, this.gridTileColumns, this.gridTileRows);
          tile.setGridTilePosition(x, y);
          tile.setPosition(x * this.gridTileColumns, y * this.gridTileRows);
          tile.setViewOffset(x * this.gridTileWidth, y * this.gridTileHeight);
          console.log('create new tile:', tile);
          newTiles.push(tile);
        } else {
          console.log('found previous tile:', tile);
          knownTiles.push(tile);
        }
      }
    }

    this.gridTiles = knownTiles.concat(newTiles);
    // TODO remove obsolete tiles

    // 3. render all tiles
    //
    this.gridTiles.forEach((gridTile) => gridTile.fetchTileIds());
  }
}
