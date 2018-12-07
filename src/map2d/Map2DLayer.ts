import { IMap2DLayerData } from './IMap2DLayerData';
import { IMap2DLayerRenderer } from './IMap2DLayerRenderer';
import { Map2DLayerTile } from './Map2DLayerTile';
import { Map2DView } from './Map2DView';

const takeFrom = (tiles: Map2DLayerTile[], left: number, top: number): Map2DLayerTile => {
  const idx = tiles.findIndex((tile) => tile.isLayerTilePosition(left, top));
  if (idx !== -1) {
    return tiles.splice(idx, 1)[0];
  }
  return null;
};

/**
 * Represents a single layer of a [[Map2DView]].
 * Internally the layer is organized as a grid of tiles (see [[Map2DLayerTile]]).
 * The layer is responsible for the lifecycle of the tiles dependent on their visibility
 * which is defined by [[Map2DView]].
 */
export class Map2DLayer {

  readonly tileColumns: number;
  readonly tileRows: number;
  readonly tileWidth: number;
  readonly tileHeight: number;

  tiles: Map2DLayerTile[] = [];

  constructor(
    readonly view: Map2DView,
    readonly layerRenderer: IMap2DLayerRenderer,
    readonly layerData: IMap2DLayerData,
  ) {
    this.tileColumns = Math.ceil(view.layerTileWidth / layerData.tileWidth);
    this.tileRows = Math.ceil(view.layerTileHeight / layerData.tileHeight);
    this.tileWidth = this.tileColumns * layerData.tileWidth;
    this.tileHeight = this.tileRows * layerData.tileHeight;
  }

  /**
   * Create, update or delete the tiles dependent of their visibility.
   * You should call this only once per frame.
   */
  update() {
    // I. create visible map tiles (and remove/dispose unvisible)
    // ---------------------------------------------------------------

    const viewHalfWidth = this.view.width * 0.5;
    const viewHalfHeight = this.view.height * 0.5;

    const left = Math.floor((this.view.centerX - viewHalfWidth) / this.tileWidth);
    const top = Math.floor((this.view.centerY - viewHalfHeight) / this.tileHeight);
    const right = Math.ceil((this.view.centerX + viewHalfWidth) / this.tileWidth);
    const bottom = Math.ceil((this.view.centerY + viewHalfHeight) / this.tileHeight);

    const width = right - left;
    const height = bottom - top;

    // console.log('[Map2DGridTile] (gridTiles) topLeft', left, top, 'bottomRight', right, bottom, 'sizes', width, height);
    // tslint:disable-next-line:max-line-length
    // console.log('[Map2DGridTile] (tiles) topLeft', left * this.gridTileColumns, top * this.gridTileRows, 'bottomRight', right * this.gridTileColumns, bottom * this.gridTileRows, 'sizes', width * this.gridTileColumns, height * this.gridTileRows);
    // tslint:disable-next-line:max-line-length
    // console.log('[Map2DGridTile] (pixels) topLeft', left * this.gridTileWidth, top * this.gridTileHeight, 'bottomRight', right * this.gridTileWidth, bottom * this.gridTileHeight, 'sizes', width * this.gridTileWidth, height * this.gridTileHeight);

    const reuseTiles = this.tiles.slice(0);
    const knownTiles: Map2DLayerTile[] = [];
    const newTileCoords: number[][] = [];
    let removeTiles: string[] = [];

    for (let yOffset = 0; yOffset < height; ++yOffset) {
      for (let xOffset = 0; xOffset < width; ++xOffset) {
        const x = left + xOffset;
        const y = top + yOffset;
        const tile = takeFrom(reuseTiles, x, y);
        if (tile) {
          // console.log('[Map2DGridTile] found previous grid-tile:', tile.id, tile);
          knownTiles.push(tile);
        } else {
          newTileCoords.push([x, y]);
        }
      }
    }

    // II. create geometries for all *new* map tiles
    // -------------------------------------------------

    const newTiles: Map2DLayerTile[] = newTileCoords.map(([x, y]: number[]): Map2DLayerTile => {
      const prevTile = reuseTiles.shift();
      if (prevTile) {
        removeTiles.push(prevTile.id);
      }
      return this.createTile(x, y, prevTile);
    });

    // III. render visible tiles
    // -------------------------------

    this.tiles = knownTiles.concat(newTiles);
    this.tiles.forEach((tile) => {
      tile.fetchTileIds();
      this.layerRenderer.updateLayerTile(tile);
    });

    // IV. remove unused tiles
    // -----------------------------

    removeTiles = removeTiles.concat(reuseTiles.map((tile) => tile.id));
    removeTiles.forEach((tile) => this.layerRenderer.removeLayerTile(tile));
  }

  private createTile(x: number, y: number, reuseTile?: Map2DLayerTile) {
    const tile = reuseTile || new Map2DLayerTile(this.layerData, this.tileColumns, this.tileRows);
    tile.setLayerTilePosition(x, y);
    tile.setPosition(x * this.tileColumns, y * this.tileRows);
    tile.setViewOffset(x * this.tileWidth, y * this.tileHeight);
    // if (prevGridTile) {
      // console.log('[Map2DGridTile] re-init grid-tile:', tile.id, tile);
    // }
    this.layerRenderer.addLayerTile(tile);
    return tile;
  }
}
