import { IMap2DRenderer } from './IMap2DRenderer';
import { Map2DViewLayer } from './Map2DViewLayer';

/**
 * Represents a 2d section from a 2d map along the x- and y- axis.
 * A 2d map consists of one or more layers.
 *
 * The unit of measurement are *pixels* unless otherwise stated.
 */
export class Map2DView {

  centerX: number;
  centerY: number;
  width: number;
  height: number;

  readonly layerTileWidth: number;
  readonly layerTileHeight: number;

  readonly layers: Map2DViewLayer[] = [];

  private readonly renderer: IMap2DRenderer;

  /**
   * @param centerX horizontal center position
   * @param centerY vertical center position
   * @param layerTileWidth approximate width of a *grid tile* (see [[Map2DLayerTile]]) in *pixels*. The real size is a multiple of the size of a single tile.
   * @param layerTileHeight approximate height of a *grid tile* (see [[Map2DLayerTile]]) in *pixels* The real size is a multiple of the size of a single tile.
   */
  constructor(
    renderer: IMap2DRenderer,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    layerTileWidth: number,
    layerTileHeight: number,
  ) {
    this.renderer = renderer;
    this.centerX = centerX;
    this.centerY = centerY;
    this.width = width;
    this.height = height;
    this.layerTileWidth = layerTileWidth;
    this.layerTileHeight = layerTileHeight;
  }

  get left() {
    const halfWidth = this.width / 2;
    return this.centerX - halfWidth;
  }

  get top() {
    const halfHeight = this.height / 2;
    return this.centerY - halfHeight;
  }

  addLayer(layer: Map2DViewLayer) {
    this.layers.push(layer);
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
    this.renderer.beginRender(this);
    this.layers.forEach((layer) => layer.update());
    this.renderer.endRender(this);
  }
}
