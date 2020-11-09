export class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  setPolar(radius, angle) {
    this.x = Math.cos(angle) * radius;
    this.y = Math.sin(angle) * radius;
    return this;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  static from(v) {
    return new Vec2(v.x, v.y);
  }

  toString() {
    return `{ ${this.x}, ${this.y} }`;
  }

  copyToArray(outArray, offset = 0) {
    outArray[offset] = this.x;
    outArray[offset + 1] = this.y;
    return this;
  }

  copyFromArray(inArray, offset = 0) {
    this.x = inArray[offset];
    this.y = inArray[offset + 1];
    return this;
  }

  /* -------------------------------------------------------------------
   * IN-PLACE OPERATIONS
   * this = this op b
   * ------------------------------------------------------------------- */

  // this = this + b
  add(b) {
    this.x += b.x;
    this.y += b.y;
    return this;
  }

  // this = this - b
  subtract(b) {
    this.x -= b.x;
    this.y -= b.y;
    return this;
  }

  // this = this * s
  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  // this = this (*) b
  elementMultiply(b) {
    this.x *= b.x;
    this.y *= b.y;
    return this;
  }

  // this = -this
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  // this = this / |this|
  normalize() {
    const n = 1 / Math.sqrt(this.x * this.x + this.y * this.y);
    this.x *= n;
    this.y *= n;
    return this;
  }

  // this = this + b * s
  addFactor(b, s) {
    this.x += b.x * s;
    this.y += b.y * s;
    return this;
  }

  // this = this + t * (b - this)
  lerp(b, t) {
    this.x += t * (b.x - this.x);
    this.y += t * (b.y - this.y);
    return this;
  }

  rotate(angle) {
    const $vx = this.x;
    const $vy = this.y;
    const $sina = Math.sin(angle);
    const $cosa = Math.cos(angle);

    this.x = $vx * $cosa - $vy * $sina;
    this.y = $vx * $sina + $vy * $cosa;
    return this;
  }

  rotateAround(angle, center) {
    const $vx = this.x;
    const $vy = this.y;
    const $cx = center.x;
    const $cy = center.y;
    const $sina = Math.sin(angle);
    const $cosa = Math.cos(angle);

    this.x = $cx + ($vx - $cx) * $cosa + ($cy - $vy) * $sina;
    this.y = $cy + ($vy - $cy) * $cosa + ($vx - $cx) * $sina;
    return this;
  }

  /* -------------------------------------------------------------------
   * CALCULATE+COPY OPERATIONS
   * this = a op b
   * note that 'this' merely becomes a container for the result - this's value
   * does not effect the calculation. the intent is so that usage follows the
   * order of infix notation. for example:
   *   result.setAdd(a, b)
   * would be equivalent to
   *   result = a + b
   * ------------------------------------------------------------------- */

  // this = a
  setEquals(a) {
    this.x = Number(a.x);
    this.y = Number(a.y);
    return this;
  }

  // this = a + b
  setAdd(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
  }

  // this = a - b
  setSubtract(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  }

  // this = a * s
  setScale(a, s) {
    this.x = a.x * s;
    this.y = a.y * s;
    return this;
  }

  // this = a (*) b
  setElementMultiply(a, b) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    return this;
  }

  // this = -a
  setNegate(a) {
    this.x = -a.x;
    this.y = -a.y;
    return this;
  }

  // this = a / |a|
  setNormalize(a) {
    const n = 1 / Math.sqrt(a.x * a.x + a.y * a.y);
    this.x = a.x * n;
    this.y = a.y * n;
    return this;
  }

  // this = a + t * (b - a)
  setLerp(a, b, t) {
    this.x = a.x + t * (b.x - a.x);
    this.y = a.y + t * (b.y - a.y);
    return this;
  }

  // this = a + b * s
  setAddFactor(a, b, s) {
    this.x = a.x + b.x * s;
    this.y = a.y + b.y * s;
    return this;
  }

  setRotate(a, angle) {
    const $vx = a.x;
    const $vy = a.y;
    const $sina = Math.sin(angle);
    const $cosa = Math.cos(angle);

    this.x = $vx * $cosa - $vy * $sina;
    this.y = $vx * $sina + $vy * $cosa;
    return this;
  }

  setRotateAround(a, angle, center) {
    const $vx = a.x;
    const $vy = a.y;
    const $cx = center.x;
    const $cy = center.y;
    const $sina = Math.sin(angle);
    const $cosa = Math.cos(angle);

    this.x = $cx + ($vx - $cx) * $cosa + ($cy - $vy) * $sina;
    this.y = $cy + ($vy - $cy) * $cosa + ($vx - $cx) * $sina;
    return this;
  }

  /* -------------------------------------------------------------------
   * SCALAR FUNCTIONS
   * ------------------------------------------------------------------- */

  // return |this|
  norm() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // return |this|^2
  normSquared() {
    return this.x * this.x + this.y * this.y;
  }

  // return 1/|this|
  normReciprocal() {
    return 1 / Math.sqrt(this.x * this.x + this.y * this.y);
  }

  atan() {
    return Math.atan2(this.y, this.x);
  }

  // return this . b
  dot(b) {
    return this.x * b.x + this.y * b.y;
  }

  // return |b - this|
  distance(b) {
    const dx = b.x - this.x;
    const dy = b.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // return |b - this|^2
  distanceSquared(b) {
    const dx = b.x - this.x;
    const dy = b.y - this.y;
    return dx * dx + dy * dy;
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }

  isDefined() {
    return !isNaN(this.x) && !isNaN(this.y);
  }

  isFinite() {
    return isFinite(this.x) && isFinite(this.y);
  }

  isNearZero(epsilon) {
    return (
      this.x <= epsilon &&
      this.y <= epsilon &&
      -this.x <= epsilon &&
      -this.y <= epsilon
    );
  }

  isEqual(b) {
    if (!b) {
      return false;
    }
    return this.x === b.x && this.y === b.y;
  }

  isClose(b, epsilon) {
    if (!b) {
      return false;
    }
    let d;
    return (
      (d = this.x - b.x) <= epsilon &&
      -d <= epsilon &&
      (d = this.y - b.y) <= epsilon &&
      -d <= epsilon
    );
  }
}
