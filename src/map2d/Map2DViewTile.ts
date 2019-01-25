import { IMap2DLayerData } from './IMap2DLayerData';

/**
 * Represents a 2d section (a *tile*) of a [[Map2DViewLayer]].
 *
 * Internally these *view layer tiles* are organized as a grid of *sub tiles*
 * which are defined by an id (see [[IMap2DLayerData]]).
 *
 * The instances of this class are reused among the [[Map2DViewLayer]].
 *
 * The unit of measurement are *tiles* unless otherwise stated.
 */
export class Map2DViewTile {

  readonly layerData: IMap2DLayerData;

  readonly width: number;
  readonly height: number;

  readonly tileIds: Uint32Array;

  tileIdsNeedsUpdate: boolean = true;

  layerTileLeft: number;
  layerTileTop: number;

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

  constructor(layerData: IMap2DLayerData, width: number, height: number) {
    this.layerData = layerData;

    this.width = width;
    this.height = height;

    this.tileIds = new Uint32Array(width * height);
  }

  get id() {
    return `${this.left},${this.top}|${this.width}x${this.height}|${this.layerData.name}|M2DGT`;
  }

  /**
   * View dimension in *pixels*
   */
  get viewWidth() { return this.layerData.tileWidth * this.width; }

  /**
   * View dimension in *pixels*
   */
  get viewHeight() { return this.layerData.tileHeight * this.height; }

  getTileIdAt(x: number, y: number) {
    return this.tileIds[x + (y * this.width)];
  }

  setLayerTilePosition(left: number, top: number) {
    this.layerTileLeft = left;
    this.layerTileTop = top;
  }

  isLayerTilePosition(left: number, top: number) {
    return this.layerTileLeft === left && this.layerTileTop === top;
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
      this.layerData.getTileIdsWithin(this._left, this._top, this.width, this.height, this.tileIds);
      this.tileIdsNeedsUpdate = false;
    }
    return this;
  }
}
