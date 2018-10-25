
/**
 * Represents a 2D axis aligned boundary box.
 * Uses a right-handed coordinate system.
 */
export class AABB2 {
  left: number;
  top: number;
  width: number;
  height: number;

  constructor(left: number, top: number, width: number, height: number) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }

  clone() {
    return new AABB2(this.left, this.top, this.width, this.height);
  }

  get right() { return this.left + this.width; }
  get bottom() { return this.top + this.height; }

  get centerX() { return this.left + (this.width / 2); }
  get centerY() { return this.top + (this.height / 2); }

  /**
   * @return Return `true` if point is within
   */
  isInside(x: number, y: number) {
    return this.left <= x && x < this.right && this.top <= y && y < this.bottom;
  }

  /**
   * @return Return `true` if both overlap
   */
  isIntersecting(aabb: AABB2) {
    return !(
      aabb.right <= this.left ||
      aabb.left >= this.right ||
      aabb.bottom <= this.top ||
      aabb.top >= this.bottom
    );
  }
}
