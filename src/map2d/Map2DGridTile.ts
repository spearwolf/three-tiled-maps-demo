import { IMap2DLayer } from './IMap2DLayer';

/**
 * Represents a specific 2d section (a *grid tile*) of a Map2DLayerGrid.
 * Holds a set of *tile ids*.
 *
 * The unit of measurement are *tiles* unless otherwise stated.
 */
export class Map2DGridTile {
  readonly layer: IMap2DLayer;

  readonly width: number;
  readonly height: number;

  readonly tileIds: Uint32Array;

  tileIdsNeedsUpdate: boolean = true;

  gridTileLeft: number;
  gridTileTop: number;

  /**
   * Uppler left view position offset in *pixels*
   */
  viewOffsetX: number;

  /**
   * Uppler left view position offset in *pixels*
   */
  viewOffsetY: number;

  private _top: number = 0;
  private _left: number = 0;

  constructor(layer: IMap2DLayer, width: number, height: number) {
    this.layer = layer;

    this.width = width;
    this.height = height;

    this.tileIds = new Uint32Array(width * height);
  }

  get id() {
    return `${this.left},${this.top}|${this.width}x${this.height}|${this.layer.name}|M2DGT`;
  }

  /**
   * View dimension in *pixels*
   */
  get viewWidth() { return this.layer.tileWidth * this.width; }

  /**
   * View dimension in *pixels*
   */
  get viewHeight() { return this.layer.tileHeight * this.height; }

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
      this.layer.getTileIdsWithin(this._left, this._top, this.width, this.height, this.tileIds);
      this.tileIdsNeedsUpdate = false;
    }
    return this;
  }
}
