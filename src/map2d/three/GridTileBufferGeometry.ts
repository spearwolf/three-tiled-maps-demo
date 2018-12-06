import * as THREE from 'three';

import { GridTile } from './GridTile';

export class GridTileBufferGeometry extends THREE.BufferGeometry {
  readonly type: string = 'GridTileBufferGeometry';

  constructor(gridTile: GridTile) {
    super();

    const { map2dGridTile, textureLibrary } = gridTile;

    const { viewWidth, viewHeight, viewOffsetX, viewOffsetY } = map2dGridTile;

    const tileCols = map2dGridTile.width;
    const tileRows = map2dGridTile.height;

    const tileWidth = viewWidth / tileCols;
    const tileHeight = viewHeight / tileRows;

    const vertices = [];
    const normals = [];
    const uvs = [];

    const up = new THREE.Vector3(0, 0, 1);

    let y = -viewOffsetY;

    for (let row = 0; row < tileRows; ++row) {

      let x = viewOffsetX;

      for (let col = 0; col < tileCols; ++col) {

        const y0 = viewHeight - y;
        const x1 = x + tileWidth;
        const y1 = viewHeight - (y + tileHeight);

        vertices.push(x, y0, 0);
        vertices.push(x, y1, 0);
        vertices.push(x1, y0, 0);
        vertices.push(x, y1, 0);
        vertices.push(x1, y1, 0);
        vertices.push(x1, y0, 0);

        normals.push(up.x, up.y, up.z);
        normals.push(up.x, up.y, up.z);
        normals.push(up.x, up.y, up.z);
        normals.push(up.x, up.y, up.z);
        normals.push(up.x, up.y, up.z);
        normals.push(up.x, up.y, up.z);

        const tileId = map2dGridTile.getTileIdAt(col, tileRows - row - 1);
        const texture = textureLibrary.getTextureById(tileId);

        if (texture) {
          const { minS, minT, maxS, maxT } = texture;

          uvs.push(minS, maxT);
          uvs.push(minS, minT);
          uvs.push(maxS, maxT);
          uvs.push(minS, minT);
          uvs.push(maxS, minT);
          uvs.push(maxS, maxT);

        } else {
          uvs.push(0, 1);
          uvs.push(0, 0);
          uvs.push(1, 1);
          uvs.push(0, 0);
          uvs.push(1, 0);
          uvs.push(1, 1);
        }

        x += tileWidth;
      }
      y += tileHeight;
    }

    this.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    this.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  }
}
