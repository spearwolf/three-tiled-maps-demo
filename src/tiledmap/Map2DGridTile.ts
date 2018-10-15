// tslint:disable:variable-name

import { TiledMapLayer } from './TiledMapLayer';

export class Map2DGridTile {
  public readonly width: number;
  public readonly height: number;

  public readonly tileIds: Uint32Array;

  public tileIdsNeedsUpdate: boolean = true;

  private _top: number = 0;
  private _left: number = 0;

  private _layer: TiledMapLayer;

  constructor(layer: TiledMapLayer, width: number, height: number) {
    this._layer = layer;

    this.width = width;
    this.height = height;

    this.tileIds = new Uint32Array(width * height);
  }

  public set layer(layer: TiledMapLayer) {
    if (this._layer !== layer) {
      this._layer = layer;
      this.tileIdsNeedsUpdate = true;
    }
  }

  public get layer(): TiledMapLayer { return this._layer; }

  public set top(top: number) {
    if (this._top !== top) {
      this._top = top;
      this.tileIdsNeedsUpdate = true;
    }
  }

  public get top(): number { return this._top; }

  public set left(left: number) {
    if (this._left !== left) {
      this._left = left;
      this.tileIdsNeedsUpdate = true;
    }
  }

  public get left(): number { return this._left; }

  public setPosition(left: number, top: number) {
    if (this._top !== top || this._left !== left) {
      this._top = top;
      this._left = left;
      this.tileIdsNeedsUpdate = true;
    }
    return this;
  }

  public fetchTileIds() {
    if (this.tileIdsNeedsUpdate) {
      this._layer.getTileIdsAt(this._left, this._top, this.width, this.height, this.tileIds);
      this.tileIdsNeedsUpdate = false;
    }
    return this;
  }
}
