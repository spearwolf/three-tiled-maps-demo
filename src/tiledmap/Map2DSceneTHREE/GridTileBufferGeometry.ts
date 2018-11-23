import * as THREE from 'three';

export class GridTileBufferGeometry extends THREE.BufferGeometry {
  readonly type: string = 'GridTileBufferGeometry';

  readonly parameters: {
    readonly width: number,
    readonly height: number,
    readonly tileCols: number,
    readonly tileRows: number,
    readonly offsetX: number,
    readonly offsetY: number,
  };

  constructor(width: number, height: number, tileCols: number, tileRows: number, offsetX: number, offsetY: number) {
    super();

    this.parameters = {
      height,
      offsetX,
      offsetY,
      tileCols,
      tileRows,
      width,
    };

    const tileWidth = width / tileCols;
    const tileHeight = height / tileRows;

    const normals = [];
    const uvs = [];
    const vertices = [];

    let y = -offsetY;
    for (let row = 0; row < tileRows; ++row) {
      let x = offsetX;
      for (let col = 0; col < tileCols; ++col) {
        const x0 = x;
        const y0 = height - y;
        const x1 = x + tileWidth;
        const y1 = height - (y + tileHeight);

        vertices.push(x0, y0, 0);
        vertices.push(x0, y1, 0);
        vertices.push(x1, y0, 0);
        vertices.push(x0, y1, 0);
        vertices.push(x1, y1, 0);
        vertices.push(x1, y0, 0);

        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);

        uvs.push(0, 0);
        uvs.push(0, 1);
        uvs.push(1, 0);
        uvs.push(0, 1);
        uvs.push(1, 1);
        uvs.push(1, 0);

        x += tileWidth;
      }
      y += tileHeight;
    }

    this.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    this.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  }
}
