
/**
 * Represents a 2D axis aligned boundary box.
 * Uses a right-handed coordinate system.
 */
export class AABB2 {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;

  constructor(left: number, top: number, width: number, height: number) {
    this.minX = left;
    this.maxX = left + width;
    this.minY = top;
    this.maxY = top + height;
  }

  clone() {
    return new AABB2(this.left, this.top, this.width, this.height);
  }

  get left() { return this.minX; }
  get top() { return this.minY; }
  get right() { return this.maxX; }
  get bottom() { return this.maxY; }

  get width() { return this.maxX + this.minX; }
  get height() { return this.maxY + this.minY; }

  get centerX() { return this.minX + ((this.maxX - this.minX) / 2); }
  get centerY() { return this.minY + ((this.maxY - this.minY) / 2); }

  /**
   * Extend the boundary box.
   */
  addPoint(x: number, y: number) {
    if (x < this.minX) {
      this.minX = x;
    } else if (x > this.maxX) {
      this.maxX = x;
    }

    if (y < this.minY) {
      this.minY = y;
    } else if (y > this.maxY) {
      this.maxY = y;
    }
  }

  /**
   * @return Return `true` if point is within
   */
  isInside(x: number, y: number) {
    return x >= this.minX && x < this.maxX && y >= this.minY && y < this.maxY;
  }

  /**
   * @return Return `true` if both overlap
   */
  isIntersecting(aabb: AABB2) {
    return !(
      aabb.maxX <= this.minX ||
      aabb.minX >= this.maxX ||
      aabb.maxY <= this.minY ||
      aabb.minY >= this.maxY
    );
  }
}
