import { IMap2DLayer } from './IMap2DLayer';

/**
 * Represents a specific 2d section (a *grid tile*) of a Map2DLayerGrid.
 * Holds a group of *tile ids*.
 * The unit of measurement are *tiles* unless otherwise stated.
 */
export class Map2DGridTile {
  readonly width: number;
  readonly height: number;

  readonly tileIds: Uint32Array;

  tileIdsNeedsUpdate: boolean = true;

  gridTileLeft: number;
  gridTileTop: number;

  /**
   * View position in *pixels*
   */
  viewOffsetX: number;

  /**
   * View position in *pixels*
   */
  viewOffsetY: number;

  private _top: number = 0;
  private _left: number = 0;

  private _layer: IMap2DLayer;

  constructor(layer: IMap2DLayer, width: number, height: number) {
    this._layer = layer;

    this.width = width;
    this.height = height;

    this.tileIds = new Uint32Array(width * height);
  }

  setGridTilePosition(left: number, top: number) {
    this.gridTileLeft = left;
    this.gridTileTop = top;
  }

  isGridTilePosition(left: number, top: number) {
    return this.gridTileLeft === left && this.gridTileTop === top;
  }

  setViewOffset(x: number, y: number) {
    this.viewOffsetX = x;
    this.viewOffsetY = y;
  }

  set layer(layer: IMap2DLayer) {
    if (this._layer !== layer) {
      this._layer = layer;
      this.tileIdsNeedsUpdate = true;
    }
  }

  get layer(): IMap2DLayer { return this._layer; }

  set top(top: number) {
    if (this._top !== top) {
      this._top = top;
      this.tileIdsNeedsUpdate = true;
    }
  }

  get top(): number { return this._top; }

  set left(left: number) {
    if (this._left !== left) {
      this._left = left;
      this.tileIdsNeedsUpdate = true;
    }
  }

  get left(): number { return this._left; }

  setPosition(left: number, top: number) {
    if (this._top !== top || this._left !== left) {
      this._top = top;
      this._left = left;
      this.tileIdsNeedsUpdate = true;
    }
    return this;
  }

  fetchTileIds() {
    if (this.tileIdsNeedsUpdate) {
      this._layer.getTileIdsWithin(this._left, this._top, this.width, this.height, this.tileIds);
      this.tileIdsNeedsUpdate = false;
    }
    return this;
  }
}
