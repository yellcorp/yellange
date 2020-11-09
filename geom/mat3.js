// memory layout is column major
// translation values in final column, like OpenGL

// represents a space with its first two columns as basis vectors
// and the last column as origin

//  0  3  6 (tx)
//  1  4  7 (ty)
//  2  5  8 <-- 0 0 1 if matrix represents an affine transform

import { det3x3 } from './det3x3';

function multiply(ma, mb, out) {
  const a = ma.array;
  const a11 = a[0];
  const a21 = a[1];
  const a31 = a[2];
  const a12 = a[3];
  const a22 = a[4];
  const a32 = a[5];
  const a13 = a[6];
  const a23 = a[7];
  const a33 = a[8];

  const b = mb.array;
  const b11 = b[0];
  const b21 = b[1];
  const b31 = b[2];
  const b12 = b[3];
  const b22 = b[4];
  const b32 = b[5];
  const b13 = b[6];
  const b23 = b[7];
  const b33 = b[8];

  const o = out.array;
  o[0] = a11 * b11 + a12 * b21 + a13 * b31;
  o[1] = a21 * b11 + a22 * b21 + a23 * b31;
  o[2] = a31 * b11 + a32 * b21 + a33 * b31;

  o[3] = a11 * b12 + a12 * b22 + a13 * b32;
  o[4] = a21 * b12 + a22 * b22 + a23 * b32;
  o[5] = a31 * b12 + a32 * b22 + a33 * b32;

  o[6] = a11 * b13 + a12 * b23 + a13 * b33;
  o[7] = a21 * b13 + a22 * b23 + a23 * b33;
  o[8] = a31 * b13 + a32 * b23 + a33 * b33;

  return out;
}

export class Mat3 {
  constructor(sourceArray) {
    if (sourceArray) {
      this.array = sourceArray;
    } else if (typeof Float32Array === 'undefined') {
      this.array = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    } else {
      this.array = new Float32Array(9);
    }
  }

  initIdentity() {
    const ta = this.array;
    ta[0] = 1;
    ta[1] = 0;
    ta[2] = 0;
    ta[3] = 0;
    ta[4] = 1;
    ta[5] = 0;
    ta[6] = 0;
    ta[7] = 0;
    ta[8] = 1;
    return this;
  }

  setColumnMajor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
    const ta = this.array;
    ta[0] = m11;
    ta[1] = m21;
    ta[2] = m31;
    ta[3] = m12;
    ta[4] = m22;
    ta[5] = m32;
    ta[6] = m13;
    ta[7] = m23;
    ta[8] = m33;
    return this;
  }

  setRowMajor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
    const ta = this.array;
    ta[0] = m11;
    ta[1] = m21;
    ta[2] = m31;
    ta[3] = m12;
    ta[4] = m22;
    ta[5] = m32;
    ta[6] = m13;
    ta[7] = m23;
    ta[8] = m33;
    return this;
  }

  setTopLeftOf(mat4) {
    const ta = this.array;
    const ba = mat4.array;
    ta[0] = ba[0];
    ta[1] = ba[1];
    ta[2] = ba[2];
    ta[3] = ba[4];
    ta[4] = ba[5];
    ta[5] = ba[6];
    ta[6] = ba[8];
    ta[7] = ba[9];
    ta[8] = ba[10];
    return this;
  }

  initTranslate(x, y) {
    const ta = this.array;
    ta[0] = 1;
    ta[1] = 0;
    ta[2] = 0;
    ta[3] = 0;
    ta[4] = 1;
    ta[5] = 0;
    ta[6] = x;
    ta[7] = y;
    ta[8] = 1;
    return this;
  }

  initUniformScale(s) {
    const ta = this.array;
    ta[0] = s;
    ta[1] = 0;
    ta[2] = 0;
    ta[3] = 0;
    ta[4] = s;
    ta[5] = 0;
    ta[6] = 0;
    ta[7] = 0;
    ta[8] = 1;
    return this;
  }

  initNonUniformScale(x, y) {
    const ta = this.array;
    ta[0] = x;
    ta[1] = 0;
    ta[2] = 0;
    ta[3] = 0;
    ta[4] = y;
    ta[5] = 0;
    ta[6] = 0;
    ta[7] = 0;
    ta[8] = 1;
    return this;
  }

  initRotate(r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);

    const ta = this.array;
    ta[0] = cr;
    ta[1] = sr;
    ta[2] = 0;
    ta[3] = -sr;
    ta[4] = cr;
    ta[5] = 0;
    ta[6] = 0;
    ta[7] = 0;
    ta[8] = 1;
    return this;
  }

  clone() {
    return new Mat3().setEquals(this);
  }

  toString() {
    const rows = [];
    const row = [0, 0];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        row[j] = this.array[i + j * 3].toFixed(4);
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
    ta[4] += ba[4];
    ta[5] += ba[5];
    ta[6] += ba[6];
    ta[7] += ba[7];
    ta[8] += ba[8];
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
    ta[4] -= ba[4];
    ta[5] -= ba[5];
    ta[6] -= ba[6];
    ta[7] -= ba[7];
    ta[8] -= ba[8];
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
    ta[4] *= n;
    ta[5] *= n;
    ta[6] *= n;
    ta[7] *= n;
    ta[8] *= n;
    return this;
  }

  translate(x, y) {
    // this is a post-multiply, which means it applies a translation within the
    // space of the matrix defined by 'this', which is why it's not a simple
    // addition to the final column

    // for example, if 'this' represents a rotation, the translation should be
    // aligned to the reoriented axes
    const m = this.array;
    m[6] += x * m[0] + y * m[3];
    m[7] += x * m[1] + y * m[4];
    m[8] += x * m[2] + y * m[5];
    return this;
  }

  uniformScale(n) {
    const ta = this.array;
    ta[0] *= n;
    ta[1] *= n;
    ta[2] *= n;
    ta[3] *= n;
    ta[4] *= n;
    ta[5] *= n;
    return this;
  }

  nonUniformScale(x, y) {
    const ta = this.array;
    ta[0] *= x;
    ta[1] *= x;
    ta[2] *= x;
    ta[3] *= y;
    ta[4] *= y;
    ta[5] *= y;
    return this;
  }

  rotate(r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);
    const m = this.array;

    const a11 = m[0];
    const a21 = m[1];
    const a31 = m[2];

    const a12 = m[3];
    const a22 = m[4];
    const a32 = m[5];

    m[0] = cr * a11 + sr * a12;
    m[1] = cr * a21 + sr * a22;
    m[2] = cr * a31 + sr * a32;

    m[3] = -sr * a11 + cr * a12;
    m[4] = -sr * a21 + cr * a22;
    m[5] = -sr * a31 + cr * a32;

    return this;
  }

  // this = this ^ -1
  invert() {
    const invDet = 1 / this.det();
    const m = this.array;
    const m11 = m[0];
    const m21 = m[1];
    const m31 = m[2];
    const m12 = m[3];
    const m22 = m[4];
    const m32 = m[5];
    const m13 = m[6];
    const m23 = m[7];
    const m33 = m[8];

    m[0] = (m22 * m33 - m23 * m32) * invDet;
    m[1] = (m23 * m31 - m21 * m33) * invDet;
    m[2] = (m21 * m32 - m22 * m31) * invDet;

    m[3] = (m13 * m32 - m12 * m33) * invDet;
    m[4] = (m11 * m33 - m13 * m31) * invDet;
    m[5] = (m12 * m31 - m11 * m32) * invDet;

    m[6] = (m12 * m23 - m13 * m22) * invDet;
    m[7] = (m13 * m21 - m11 * m23) * invDet;
    m[8] = (m11 * m22 - m12 * m21) * invDet;

    return this;
  }

  // this = this ^ T
  transpose() {
    const m = this.array;

    let temp = m[1];
    m[1] = m[3];
    m[3] = temp;

    temp = m[2];
    m[2] = m[6];
    m[6] = temp;

    temp = m[5];
    m[5] = m[7];
    m[7] = temp;

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
    ta[4] = aa[4];
    ta[5] = aa[5];
    ta[6] = aa[6];
    ta[7] = aa[7];
    ta[8] = aa[8];

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
    ta[4] = aa[4] + ba[4];
    ta[5] = aa[5] + ba[5];
    ta[6] = aa[6] + ba[6];
    ta[7] = aa[7] + ba[7];
    ta[8] = aa[8] + ba[8];
    return this;
  }

  // this = a - b
  setSubtract(a, b) {
    const ta = this.array;
    const aa = a.array;
    const ba = b.array;
    ta[0] = aa[0] - ba[0];
    ta[1] = aa[1] - ba[1];
    ta[2] = aa[2] - ba[2];
    ta[3] = aa[3] - ba[3];
    ta[4] = aa[4] - ba[4];
    ta[5] = aa[5] - ba[5];
    ta[6] = aa[6] - ba[6];
    ta[7] = aa[7] - ba[7];
    ta[8] = aa[8] - ba[8];
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
    ta[4] = aa[4] * s;
    ta[5] = aa[5] * s;
    ta[6] = aa[6] * s;
    ta[7] = aa[7] * s;
    ta[8] = aa[8] * s;
    return this;
  }

  setTranslate(a, x, y) {
    this.setEquals(a);
    return this.translate(x, y);
  }

  setUniformScale(a, s) {
    const ta = this.array;
    const aa = a.array;
    ta[0] = aa[0] * s;
    ta[1] = aa[1] * s;
    ta[2] = aa[2] * s;
    ta[3] = aa[3] * s;
    ta[4] = aa[4] * s;
    ta[5] = aa[5] * s;
    ta[6] = aa[6];
    ta[7] = aa[7];
    ta[8] = aa[8];
    return this;
  }

  setNonUniformScale(a, x, y) {
    const ta = this.array;
    const aa = a.array;
    ta[0] = aa[0] * x;
    ta[1] = aa[1] * x;
    ta[2] = aa[2] * x;
    ta[3] = aa[3] * y;
    ta[4] = aa[4] * y;
    ta[5] = aa[5] * y;
    ta[6] = aa[6];
    ta[7] = aa[7];
    ta[8] = aa[8];
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

    let temp = n[1];
    m[1] = n[3];
    m[3] = temp;

    m[4] = n[4];

    temp = n[2];
    m[2] = n[6];
    m[6] = temp;

    temp = n[5];
    m[5] = n[7];
    m[7] = temp;

    m[8] = n[8];

    return this;
  }

  /* -------------------------------------------------------------------
   * VECTOR FUNCTIONS
   * ------------------------------------------------------------------- */

  multiplyVec3(vin, vout) {
    const a = this.array;
    const ox = vin.x * a[0] + vin.y * a[3] + vin.z * a[6];
    const oy = vin.x * a[1] + vin.y * a[4] + vin.z * a[7];
    const oz = vin.x * a[2] + vin.y * a[5] + vin.z * a[8];

    vout.x = ox;
    vout.y = oy;
    vout.z = oz;
  }

  multiplyVec2(vin, vout) {
    const a = this.array;
    const ox = vin.x * a[0] + vin.y * a[3] + a[6];
    const oy = vin.x * a[1] + vin.y * a[4] + a[7];

    // assume bottom row is 0 0 1
    vout.x = ox;
    vout.y = oy;
  }

  /* -------------------------------------------------------------------
   * SCALAR FUNCTIONS
   * ------------------------------------------------------------------- */

  det() {
    const m = this.array;
    return det3x3(m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]);
  }

  isEqual(other) {
    if (!other) {
      return false;
    }

    const a = this.array;
    const b = other.array;

    return (
      a[0] === b[0] &&
      a[1] === b[1] &&
      a[2] === b[2] &&
      a[3] === b[3] &&
      a[4] === b[4] &&
      a[5] === b[5] &&
      a[6] === b[6] &&
      a[7] === b[7] &&
      a[8] === b[8]
    );
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
      -d <= epsilon &&
      (d = a[4] - b[4]) <= epsilon &&
      -d <= epsilon &&
      (d = a[5] - b[5]) <= epsilon &&
      -d <= epsilon &&
      (d = a[6] - b[6]) <= epsilon &&
      -d <= epsilon &&
      (d = a[7] - b[7]) <= epsilon &&
      -d <= epsilon &&
      (d = a[8] - b[8]) <= epsilon &&
      -d <= epsilon
    );
  }

  isFinite() {
    const ta = this.array;
    return (
      isFinite(ta[0]) &&
      isFinite(ta[1]) &&
      isFinite(ta[2]) &&
      isFinite(ta[3]) &&
      isFinite(ta[4]) &&
      isFinite(ta[5]) &&
      isFinite(ta[6]) &&
      isFinite(ta[7]) &&
      isFinite(ta[8])
    );
  }
}
