export class Vec4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  clone() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  static from(v) {
    return new Vec4(v.x, v.y, v.z, v.w);
  }

  toString() {
    return `{ ${this.x}, ${this.y}, ${this.z}, ${this.w} }`;
  }

  copyToArray(outArray, offset = 0) {
    outArray[offset] = this.x;
    outArray[offset + 1] = this.y;
    outArray[offset + 2] = this.z;
    outArray[offset + 3] = this.w;
    return this;
  }

  copyFromArray(inArray, offset = 0) {
    this.x = inArray[offset];
    this.y = inArray[offset + 1];
    this.z = inArray[offset + 2];
    this.w = inArray[offset + 3];
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
    this.z += b.z;
    this.w += b.w;
    return this;
  }

  // this = this - b
  subtract(b) {
    this.x -= b.x;
    this.y -= b.y;
    this.z -= b.z;
    this.w -= b.w;
    return this;
  }

  // this = this * s
  scale(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;
    return this;
  }

  // this = this (*) b
  elementMultiply(b) {
    this.x *= b.x;
    this.y *= b.y;
    this.z *= b.z;
    this.w *= b.w;
    return this;
  }

  // this = -this
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
    return this;
  }

  // this = this / |this|
  normalize() {
    const n =
      1 /
      Math.sqrt(
        this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
      );
    this.x *= n;
    this.y *= n;
    this.z *= n;
    this.w *= n;
    return this;
  }

  // this = this + t * (b - this)
  lerp(b, t) {
    this.x += t * (b.x - this.x);
    this.y += t * (b.y - this.y);
    this.z += t * (b.z - this.z);
    this.w += t * (b.w - this.w);
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
    this.z = Number(a.z);
    this.w = a.w == null ? 1 : Number(a.w);
    return this;
  }

  // this = a + b
  setAdd(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    this.w = a.w + b.w;
    return this;
  }

  // this = a - b
  setSubtract(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    this.w = a.w - b.w;
    return this;
  }

  // this = a * s
  setScale(a, s) {
    this.x = a.x * s;
    this.y = a.y * s;
    this.z = a.z * s;
    this.w = a.w * s;
    return this;
  }

  // this = a (*) b
  setElementMultiply(a, b) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;
    this.w = a.w * b.w;
    return this;
  }

  // this = -a
  setNegate(a) {
    this.x = -a.x;
    this.y = -a.y;
    this.z = -a.z;
    this.w = -a.w;
    return this;
  }

  // this = a / |a|
  setNormalize(a) {
    const n = 1 / Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w);
    this.x = a.x * n;
    this.y = a.y * n;
    this.z = a.z * n;
    this.w = a.w * n;
    return this;
  }

  // this = a + t * (b - a)
  setLerp(a, b, t) {
    this.x = a.x + t * (b.x - a.x);
    this.y = a.y + t * (b.y - a.y);
    this.z = a.z + t * (b.z - a.z);
    this.w = a.w + t * (b.w - a.w);
    return this;
  }

  /* -------------------------------------------------------------------
   * SCALAR FUNCTIONS
   * ------------------------------------------------------------------- */

  // return |this|
  norm() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }

  // return |this|^2
  normSquared() {
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }

  // return 1/|this|
  normReciprocal() {
    return (
      1 /
      Math.sqrt(
        this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
      )
    );
  }

  // return this . b
  dot(b) {
    return this.x * b.x + this.y * b.y + this.z * b.z + this.w * b.w;
  }

  // return |b - this|
  distance(b) {
    const dx = b.x - this.x;
    const dy = b.y - this.y;
    const dz = b.z - this.z;
    const dw = b.w - this.w;
    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
  }

  // return |b - this|^2
  distanceSquared(b) {
    const dx = b.x - this.x;
    const dy = b.y - this.y;
    const dz = b.z - this.z;
    const dw = b.w - this.w;
    return dx * dx + dy * dy + dz * dz + dw * dw;
  }

  isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0 && this.w === 0;
  }

  isDefined() {
    return !isNaN(this.x) && !isNaN(this.y) && !isNaN(this.z) && !isNaN(this.w);
  }

  isFinite() {
    return (
      isFinite(this.x) &&
      isFinite(this.y) &&
      isFinite(this.z) &&
      isFinite(this.w)
    );
  }

  isNearZero(epsilon) {
    return (
      this.x <= epsilon &&
      this.y <= epsilon &&
      this.z <= epsilon &&
      this.w <= epsilon &&
      -this.x <= epsilon &&
      -this.y <= epsilon &&
      -this.z <= epsilon &&
      -this.w <= epsilon
    );
  }

  isEqual(b) {
    if (!b) {
      return false;
    }
    return this.x === b.x && this.y === b.y && this.z === b.z && this.w === b.w;
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
      -d <= epsilon &&
      (d = this.z - b.z) <= epsilon &&
      -d <= epsilon &&
      (d = this.w - b.w) <= epsilon &&
      -d <= epsilon
    );
  }
}
