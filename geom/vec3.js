export class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  static from(v) {
    return new Vec3(v.x, v.y, v.z);
  }

  toString() {
    return `{ ${this.x}, ${this.y}, ${this.z} }`;
  }

  copyToArray(outArray, offset = 0) {
    outArray[offset] = this.x;
    outArray[offset + 1] = this.y;
    outArray[offset + 2] = this.z;
    return this;
  }

  copyFromArray(inArray, offset = 0) {
    this.x = inArray[offset];
    this.y = inArray[offset + 1];
    this.z = inArray[offset + 2];
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
    return this;
  }

  // this = this - b
  subtract(b) {
    this.x -= b.x;
    this.y -= b.y;
    this.z -= b.z;
    return this;
  }

  // this = this * s
  scale(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  // this = this (*) b
  elementMultiply(b) {
    this.x *= b.x;
    this.y *= b.y;
    this.z *= b.z;
    return this;
  }

  // this = -this
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  // this = this x b
  cross(b) {
    const $ax = this.x;
    const $ay = this.y;
    const $az = this.z;

    const $bx = b.x;
    const $by = b.y;
    const $bz = b.z;

    this.x = $ay * $bz - $az * $by;
    this.y = $az * $bx - $ax * $bz;
    this.z = $ax * $by - $ay * $bx;
    return this;
  }

  // this = this / |this|
  normalize() {
    const n =
      1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
  }

  // this = this + b * s
  addFactor(b, s) {
    this.x += b.x * s;
    this.y += b.y * s;
    this.z += b.z * s;
    return this;
  }

  // this = this + t * (b - this)
  lerp(b, t) {
    this.x += t * (b.x - this.x);
    this.y += t * (b.y - this.y);
    this.z += t * (b.z - this.z);
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
    return this;
  }

  // this = a + b
  setAdd(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  }

  // this = a - b
  setSubtract(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }

  // this = a * s
  setScale(a, s) {
    this.x = a.x * s;
    this.y = a.y * s;
    this.z = a.z * s;
    return this;
  }

  // this = a (*) b
  setElementMultiply(a, b) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;
    return this;
  }

  // this = -a
  setNegate(a) {
    this.x = -a.x;
    this.y = -a.y;
    this.z = -a.z;
    return this;
  }

  // this = a x b
  setCross(a, b) {
    const $ax = a.x;
    const $ay = a.y;
    const $az = a.z;

    const $bx = b.x;
    const $by = b.y;
    const $bz = b.z;

    this.x = $ay * $bz - $az * $by;
    this.y = $az * $bx - $ax * $bz;
    this.z = $ax * $by - $ay * $bx;
    return this;
  }

  // this = a / |a|
  setNormalize(a) {
    const n = 1 / Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    this.x = a.x * n;
    this.y = a.y * n;
    this.z = a.z * n;
    return this;
  }

  // this = a + b * s
  setAddFactor(a, b, s) {
    this.x = a.x + b.x * s;
    this.y = a.y + b.y * s;
    this.z = a.z + b.z * s;
    return this;
  }

  // this = a + t * (b - a)
  setLerp(a, b, t) {
    this.x = a.x + t * (b.x - a.x);
    this.y = a.y + t * (b.y - a.y);
    this.z = a.z + t * (b.z - a.z);
    return this;
  }

  /* -------------------------------------------------------------------
   * SCALAR FUNCTIONS
   * ------------------------------------------------------------------- */

  // return |this|
  norm() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  // return |this|^2
  normSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  // return 1/|this|
  normReciprocal() {
    return 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  // return this . b
  dot(b) {
    return this.x * b.x + this.y * b.y + this.z * b.z;
  }

  // return |b - this|
  distance(b) {
    const dx = b.x - this.x;
    const dy = b.y - this.y;
    const dz = b.z - this.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // return |b - this|^2
  distanceSquared(b) {
    const dx = b.x - this.x;
    const dy = b.y - this.y;
    const dz = b.z - this.z;
    return dx * dx + dy * dy + dz * dz;
  }

  isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }

  isDefined() {
    return !isNaN(this.x) && !isNaN(this.y) && !isNaN(this.z);
  }

  isFinite() {
    return isFinite(this.x) && isFinite(this.y) && isFinite(this.z);
  }

  isNearZero(epsilon) {
    return (
      this.x <= epsilon &&
      this.y <= epsilon &&
      this.z <= epsilon &&
      -this.x <= epsilon &&
      -this.y <= epsilon &&
      -this.z <= epsilon
    );
  }

  isEqual(b) {
    if (!b) {
      return false;
    }
    return this.x === b.x && this.y === b.y && this.z === b.z;
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
      -d <= epsilon
    );
  }
}
