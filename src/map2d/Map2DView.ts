import { IMap2DLayer } from './IMap2DLayer';
import { IMap2DRenderer } from './IMap2DRenderer';
import { Map2DLayerGrid } from './Map2DLayerGrid';

/**
 * Represents a 2d section from a 2d map along the x- and y- axis.
 * A 2d map consists of one or more layers.
 *
 * The unit of measurement are *pixels* unless otherwise stated.
 */
export class Map2DView {

  readonly renderer: IMap2DRenderer;

  width: number;
  height: number;
  centerX: number;
  centerY: number;

  readonly gridTileWidth: number;
  readonly gridTileHeight: number;

  readonly layers: Map2DLayerGrid[] = [];

  /**
   * @param centerX horizontal center position
   * @param centerY vertical center position
   * @param gridTileWidth desired width of a *grid tile* (see Map2DGridTile) in *pixels*
   * @param gridTileHeight desired height of a *grid tile* (see Map2DGridTile) in *pixels*
   */
  constructor(renderer: IMap2DRenderer, centerX: number, centerY: number, width: number, height: number, gridTileWidth: number, gridTileHeight: number) {
    this.renderer = renderer;

    this.width = width;
    this.height = height;
    this.centerX = centerX;
    this.centerY = centerY;

    this.gridTileWidth = gridTileWidth;
    this.gridTileHeight = gridTileHeight;
  }

  get left() {
    const halfWidth = this.width / 2;
    return this.centerX - halfWidth;
  }

  get top() {
    const halfHeight = this.height / 2;
    return this.centerY - halfHeight;
  }

  appendLayer(...layers: IMap2DLayer[]) {
    layers.forEach((layer) => this.layers.push(new Map2DLayerGrid(this, layer)));
  }

  setOrigin(centerX: number, centerY: number) {
    this.centerX = centerX;
    this.centerY = centerY;
  }

  setDimension(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  update() {
    this.layers.forEach((layer) => layer.update());
    this.renderer.postRender(this);
  }
}
