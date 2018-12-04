import { Vector2 } from 'three';

export class Vector2Proxy extends Vector2 {

  private readonly trgtObj: object;
  private readonly xProp: string;
  private readonly yProp: string;

  constructor(trgtObj: object, xProp: string, yProp: string) {
    super();

    this.trgtObj = trgtObj;
    this.xProp = xProp;
    this.yProp = yProp;

    Object.defineProperties(this, {
      x: {
        get: () => (this.trgtObj as any)[this.xProp],
        set: (x: number) => (this.trgtObj as any)[this.xProp] = x,
      },
      y: {
        get: () => (this.trgtObj as any)[this.yProp],
        set: (y: number) => (this.trgtObj as any)[this.yProp] = y,
      },
    });
  }
}
