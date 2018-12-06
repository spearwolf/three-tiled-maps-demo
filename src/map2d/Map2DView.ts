import { IMap2DLayerData } from './IMap2DLayerData';
import { IMap2DRenderer } from './IMap2DRenderer';
import { Map2DLayer } from './Map2DLayer';

/**
 * Represents a 2d section from a 2d map along the x- and y- axis.
 * A 2d map consists of one or more layers.
 *
 * The unit of measurement are *pixels* unless otherwise stated.
 */
export class Map2DView {

  readonly layers: Map2DLayer[] = [];

  /**
   * @param centerX horizontal center position
   * @param centerY vertical center position
   * @param layerTileWidth approximate width of a *grid tile* (see [[Map2DLayerTile]]) in *pixels*. The real size is a multiple of the size of a single tile.
   * @param layerTileHeight approximate height of a *grid tile* (see [[Map2DLayerTile]]) in *pixels* The real size is a multiple of the size of a single tile.
   */
  constructor(
    readonly renderer: IMap2DRenderer,
    public centerX: number,
    public centerY: number,
    public width: number,
    public height: number,
    readonly layerTileWidth: number,
    readonly layerTileHeight: number,
  ) { }

  get left() {
    const halfWidth = this.width / 2;
    return this.centerX - halfWidth;
  }

  get top() {
    const halfHeight = this.height / 2;
    return this.centerY - halfHeight;
  }

  appendLayer(...layers: IMap2DLayerData[]) {
    layers.forEach((layer) => this.layers.push(new Map2DLayer(this, layer)));
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
