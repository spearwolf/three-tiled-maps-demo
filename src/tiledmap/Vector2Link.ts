import { Vector2 } from 'three';

export class Vector2Link extends Vector2 {

  private readonly obj: object;
  private readonly xProp: string;
  private readonly yProp: string;

  constructor(obj: object, xProp: string, yProp: string) {
    super();
    this.obj = obj;
    this.xProp = xProp;
    this.yProp = yProp;

    Object.defineProperties(this, {
      x: {
        get: () => (this.obj as any)[this.xProp],
        set: (x: number) => (this.obj as any)[this.xProp] = x,
      },
      y: {
        get: () => (this.obj as any)[this.yProp],
        set: (y: number) => (this.obj as any)[this.yProp] = y,
      },
    });
  }
}
