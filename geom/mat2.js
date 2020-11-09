// memory layout is column major

//  0  2
//  1  3

function multiply(ma, mb, out) {
  const a = ma.array;
  const a11 = a[0];
  const a21 = a[1];
  const a12 = a[2];
  const a22 = a[3];

  const b = mb.array;
  const b11 = b[0];
  const b21 = b[1];
  const b12 = b[2];
  const b22 = b[3];

  const o = out.array;
  o[0] = a11 * b11 + a12 * b21;
  o[1] = a21 * b11 + a22 * b21;
  o[2] = a11 * b12 + a12 * b22;
  o[3] = a21 * b12 + a22 * b22;

  return out;
}

export class Mat2 {
  constructor(sourceArray) {
    if (sourceArray) {
      this.array = sourceArray;
    } else if (typeof Float32Array === 'undefined') {
      this.array = [0, 0, 0, 0];
    } else {
      this.array = new Float32Array(4);
    }
  }

  initIdentity() {
    const $m = this.array;
    $m[0] = 1;
    $m[1] = 0;
    $m[2] = 0;
    $m[3] = 1;
    return this;
  }

  setColumnMajor(m11, m21, m12, m22) {
    const ta = this.array;
    ta[0] = m11;
    ta[1] = m21;
    ta[2] = m12;
    ta[3] = m22;
    return this;
  }

  setRowMajor(m11, m12, m21, m22) {
    const ta = this.array;
    ta[0] = m11;
    ta[1] = m21;
    ta[2] = m12;
    ta[3] = m22;
    return this;
  }

  initUniformScale(s) {
    const $m = this.array;
    $m[0] = s;
    $m[1] = 0;
    $m[2] = 0;
    $m[3] = s;
    return this;
  }

  initNonUniformScale(x, y) {
    const $m = this.array;
    $m[0] = x;
    $m[1] = 0;
    $m[2] = 0;
    $m[3] = y;
    return this;
  }

  initRotate(r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);

    const $m = this.array;
    $m[0] = cr;
    $m[1] = sr;
    $m[2] = -sr;
    $m[3] = cr;
    return this;
  }

  clone() {
    const n = new Mat2();
    n.setEquals(this);
    return n;
  }

  toString() {
    const rows = [];
    const row = [0, 0];
    const $m = this.array;

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        row[j] = $m[i + j * 2].toFixed(4);
      }
      rows.push('[ ' + row.join(', ') + ' ]');
    }
    return rows.join('\n');
  }

  /* -------------------------------------------------------------------
   * IN-PLACE OPERATIONS
   * this = this op b
   * ------------------------------------------------------------------- */

  // this = this + b
  add(b) {
    const ta = this.array;
    const ba = b.array;
    ta[0] += ba[0];
    ta[1] += ba[1];
    ta[2] += ba[2];
    ta[3] += ba[3];
    return this;
  }

  // this = this - b
  subtract(b) {
    const ta = this.array;
    const ba = b.array;
    ta[0] -= ba[0];
    ta[1] -= ba[1];
    ta[2] -= ba[2];
    ta[3] -= ba[3];
    return this;
  }

  // this = this . b
  multiply(b) {
    return multiply(this, b, this);
  }

  // this = a . this
  premultiply(a) {
    return multiply(a, this, this);
  }

  // this = this * s
  scalarMultiply(n) {
    const ta = this.array;
    ta[0] *= n;
    ta[1] *= n;
    ta[2] *= n;
    ta[3] *= n;
    return this;
  }

  nonUniformScale(x, y) {
    const ta = this.array;
    ta[0] *= x;
    ta[1] *= x;
    ta[2] *= y;
    ta[3] *= y;
    return this;
  }

  rotate(r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);
    const m = this.array;

    const a11 = m[0];
    const a21 = m[1];

    const a12 = m[3];
    const a22 = m[4];

    m[0] = cr * a11 + sr * a12;
    m[1] = cr * a21 + sr * a22;
    m[2] = cr * a12 - sr * a11;
    m[3] = cr * a22 - sr * a21;

    return this;
  }

  // this = this ^ -1
  invert() {
    const invDet = 1 / this.det();
    const m = this.array;
    const m11 = m[0];
    const m21 = m[1];
    const m12 = m[2];
    const m22 = m[3];

    m[0] = m22 * invDet;
    m[1] = -m21 * invDet;
    m[2] = -m12 * invDet;
    m[3] = m11 * invDet;

    return this;
  }

  // this = this ^ T
  transpose() {
    const m = this.array;
    const temp = m[1];
    m[1] = m[2];
    m[2] = temp;
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
    const ta = this.array;
    const aa = a.array;

    ta[0] = aa[0];
    ta[1] = aa[1];
    ta[2] = aa[2];
    ta[3] = aa[3];

    return this;
  }

  // this = a + b
  setAdd(a, b) {
    const ta = this.array;
    const aa = a.array;
    const ba = b.array;
    ta[0] = aa[0] + ba[0];
    ta[1] = aa[1] + ba[1];
    ta[2] = aa[2] + ba[2];
    ta[3] = aa[3] + ba[3];
    return this;
  }

  // this = a - b
  setSubtractd(a, b) {
    const ta = this.array;
    const aa = a.array;
    const ba = b.array;
    ta[0] = aa[0] - ba[0];
    ta[1] = aa[1] - ba[1];
    ta[2] = aa[2] - ba[2];
    ta[3] = aa[3] - ba[3];
    return this;
  }

  // this = a . b
  setMultiply(a, b) {
    return multiply(a, b, this);
  }

  // this = a * s
  setScalarMultiply(a, s) {
    const ta = this.array;
    const aa = a.array;
    ta[0] = aa[0] * s;
    ta[1] = aa[1] * s;
    ta[2] = aa[2] * s;
    ta[3] = aa[3] * s;
    return this;
  }

  setNonUniformScale(a, x, y) {
    const ta = this.array;
    const aa = a.array;
    ta[0] = aa[0] * x;
    ta[1] = aa[1] * x;
    ta[2] = aa[2] * y;
    ta[3] = aa[3] * y;
    return this;
  }

  setRotate(a, r) {
    this.setEquals(a);
    return this.rotate(r);
  }

  // this = a ^ -1
  setInverse(a) {
    this.setEquals(a);
    return this.invert();
  }

  // this = a ^ T
  setTranspose(a) {
    const m = this.array;
    const n = a.array;
    m[0] = n[0];
    const temp = n[1];
    m[1] = n[2];
    m[2] = temp;
    m[3] = n[3];
    return this;
  }

  /* -------------------------------------------------------------------
   * VECTOR FUNCTIONS
   * ------------------------------------------------------------------- */

  multiplyVec2(vin, vout) {
    const a = this.array;
    const ox = vin.x * a[0] + vin.y * a[2];
    const oy = vin.x * a[1] + vin.y * a[3];

    vout.x = ox;
    vout.y = oy;
  }

  /* -------------------------------------------------------------------
   * SCALAR FUNCTIONS
   * ------------------------------------------------------------------- */

  det() {
    const m = this.array;
    return m[0] * m[3] - m[1] * m[2];
  }

  isEqual(other) {
    if (!other) {
      return false;
    }

    const a = this.array;
    const b = other.array;

    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }

  isClose(other, epsilon) {
    if (!other) {
      return false;
    }

    const a = this.array;
    const b = other.array;

    let d;
    return (
      (d = a[0] - b[0]) <= epsilon &&
      -d <= epsilon &&
      (d = a[1] - b[1]) <= epsilon &&
      -d <= epsilon &&
      (d = a[2] - b[2]) <= epsilon &&
      -d <= epsilon &&
      (d = a[3] - b[3]) <= epsilon &&
      -d <= epsilon
    );
  }

  isFinite() {
    const ta = this.array;
    return (
      isFinite(ta[0]) && isFinite(ta[1]) && isFinite(ta[2]) && isFinite(ta[3])
    );
  }
}
Mat2.prototype.uniformScale = Mat2.prototype.scalarMultiply;

Mat2.prototype.setUniformScale = Mat2.prototype.setScalarMultiply;
