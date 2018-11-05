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
  }

  update() {
    // I. create visible map tiles (and remove/dispose unvisible)
    // ---------------------------------------------------------------

    const viewHalfWidth = this.view.width * 0.5;
    const viewHalfHeight = this.view.height * 0.5;

    const left = Math.floor((this.view.centerX - viewHalfWidth) / this.gridTileWidth);
    const top = Math.floor((this.view.centerY - viewHalfHeight) / this.gridTileHeight);
    const right = Math.ceil((this.view.centerX + viewHalfWidth) / this.gridTileWidth);
    const bottom = Math.ceil((this.view.centerY + viewHalfHeight) / this.gridTileHeight);

    const width = right - left;
    const height = bottom - top;

    console.log('[Map2DGridTile] (gridTiles) topLeft', left, top, 'bottomRight', right, bottom, 'sizes', width, height);
    // tslint:disable-next-line:max-line-length
    console.log('[Map2DGridTile] (tiles) topLeft', left * this.gridTileColumns, top * this.gridTileRows, 'bottomRight', right * this.gridTileColumns, bottom * this.gridTileRows, 'sizes', width * this.gridTileColumns, height * this.gridTileRows);
    // tslint:disable-next-line:max-line-length
    console.log('[Map2DGridTile] (pixels) topLeft', left * this.gridTileWidth, top * this.gridTileHeight, 'bottomRight', right * this.gridTileWidth, bottom * this.gridTileHeight, 'sizes', width * this.gridTileWidth, height * this.gridTileHeight);

    const prevGridTiles = this.gridTiles.slice(0);
    const knownGridTiles: Map2DGridTile[] = [];
    const newGridTileCoords: number[][] = [];
    let removeGridTiles: string[] = [];

    for (let yOffset = 0; yOffset < height; ++yOffset) {
      for (let xOffset = 0; xOffset < width; ++xOffset) {
        const x = left + xOffset;
        const y = top + yOffset;
        const tile = takeFrom(prevGridTiles, x, y);
        if (tile) {
          console.log('[Map2DGridTile] found previous grid-tile:', tile.id, tile);
          knownGridTiles.push(tile);
        } else {
          newGridTileCoords.push([x, y]);
        }
      }
    }

    // II. create geometries for all *new* map tiles
    // -------------------------------------------------

    const newGridTiles: Map2DGridTile[] = newGridTileCoords.map(([x, y]: number[]): Map2DGridTile => {
      const prevTile = prevGridTiles.shift();
      if (prevTile) {
        removeGridTiles.push(prevTile.id);
      }
      return this.makeGridTile(x, y, prevTile);
    });

    // III. render visible tiles
    // -------------------------------

    this.gridTiles = knownGridTiles.concat(newGridTiles);
    this.gridTiles.forEach((tile) => {
      tile.fetchTileIds();
      this.view.renderer.updateGridTile(tile);
    });

    // IV. remove unused tiles
    // -----------------------------

    removeGridTiles = removeGridTiles.concat(prevGridTiles.map((tile) => tile.id));
    removeGridTiles.forEach((tile) => this.view.renderer.removeGridTile(tile));
  }

  private makeGridTile(x: number, y: number, prevGridTile?: Map2DGridTile) {
    const tile = prevGridTile || new Map2DGridTile(this.layer, this.gridTileColumns, this.gridTileRows);
    tile.setGridTilePosition(x, y);
    tile.setPosition(x * this.gridTileColumns, y * this.gridTileRows);
    tile.setViewOffset(x * this.gridTileWidth, y * this.gridTileHeight);
    if (prevGridTile) {
      console.log('[Map2DGridTile] re-init grid-tile:', tile.id, tile);
    }
    this.view.renderer.addGridTile(tile);
    return tile;
  }
}
