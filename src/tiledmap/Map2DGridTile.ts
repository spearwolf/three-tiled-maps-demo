// import { AABB2 } from './AABB2';
import { TiledMapLayer } from './TiledMapLayer';

export class Map2DGridTile {
  readonly width: number;
  readonly height: number;

  readonly tileIds: Uint32Array;

  tileIdsNeedsUpdate: boolean = true;

  private _top: number = 0;
  private _left: number = 0;

  private _layer: TiledMapLayer;

  constructor(layer: TiledMapLayer, width: number, height: number) {
    this._layer = layer;

    this.width = width;
    this.height = height;

    this.tileIds = new Uint32Array(width * height);
  }

  set layer(layer: TiledMapLayer) {
    if (this._layer !== layer) {
      this._layer = layer;
      this.tileIdsNeedsUpdate = true;
    }
  }

  get layer(): TiledMapLayer { return this._layer; }

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
      this._layer.getTileIdsAt(this._left, this._top, this.width, this.height, this.tileIds);
      // this._layer.getTileIdsAt(new AABB2(this._left, this._top, this.width, this.height), this.tileIds);
      this.tileIdsNeedsUpdate = false;
    }
    return this;
  }
}
