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
    const viewHalfWidth = this.view.dimension.x * 0.5;
    const viewHalfHeight = this.view.dimension.y * 0.5;

    const left = Math.floor((this.view.origin.x - viewHalfWidth) / this.gridTileWidth);
    const top = Math.floor((this.view.origin.y - viewHalfHeight) / this.gridTileHeight);
    const right = Math.floor((this.view.origin.x + viewHalfWidth) / this.gridTileWidth);
    const bottom = Math.floor((this.view.origin.y + viewHalfHeight) / this.gridTileHeight);

    const width = right - left + 1;
    const height = bottom - top + 1;

    console.log('[gridTiles] topLeft', left, top, 'bottomRight', right, bottom, 'sizes', width, height);
    // tslint:disable-next-line:max-line-length
    console.log('[tiles] topLeft', left * this.gridTileColumns, top * this.gridTileRows, 'bottomRight', right * this.gridTileColumns, bottom * this.gridTileRows, 'sizes', width * this.gridTileColumns, height * this.gridTileRows);
    // tslint:disable-next-line:max-line-length
    console.log('[pixels] topLeft', left * this.gridTileWidth, top * this.gridTileHeight, 'bottomRight', right * this.gridTileWidth, bottom * this.gridTileHeight, 'sizes', width * this.gridTileWidth, height * this.gridTileHeight);

    // II. create geometries for all *new* map tiles
    //
    const prevTiles = this.gridTiles.slice(0);
    const newTiles: Map2DGridTile[] = [];
    const knownTiles: Map2DGridTile[] = [];

    for (let yOffset = 0; yOffset < height; ++yOffset) {
      for (let xOffset = 0; xOffset < width; ++xOffset) {
        const x = left + xOffset;
        const y = top + yOffset;
        let tile = takeFrom(prevTiles, x, y);
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
