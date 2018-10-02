import { ITiledMapData } from './ITiledMapData';
import { ITiledMapLayerData } from './ITiledMapLayerData';
import { TiledMapLayer } from './TiledMapLayer';

export class TiledMap {
  public readonly layers: Map<string, TiledMapLayer> = new Map();
  private readonly data: ITiledMapData;

  /**
   * assume tiled map orientation is orthogonal and infinite is true.
   */
  constructor(data: ITiledMapData) {
    this.data = data;
    data.layers.forEach((layerData: ITiledMapLayerData) => {
      this.layers.set(layerData.name, new TiledMapLayer(layerData));
    });
    if (!this.infinite) {
      throw new Error(`TiledMap: sorry only infinite === true maps are supported yet`);
    }
    if (this.orientation !== 'orthogonal') {
      throw new Error(`TiledMap: sorry only orientation === orthogonal maps are supported yet`);
    }
  }

  get orientation() { return this.data.orientation; }
  get renderorder() { return this.data.renderorder; }
  get infinite() { return this.data.infinite; }
}
