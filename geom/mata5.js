// memory layout is column major
// translation values in final column, like OpenGL

// only 4 x 5 elements are stored. the last row is assumed
// to be [ 0 0 0 1 ].

//  0  4  8 12 16 (tx)
//  1  5  9 13 17 (ty)
//  2  6 10 14 18 (tz)
//  3  7 11 15 19 (tw)
//  0  0  0  0  1  <-- literal

import { det4x4 } from './det4x4';

function multiply(ma, mb, mout) {
  const a = ma.array;
  const b = mb.array;
  return mout.setColumnMajor(
    // generated code follows
    a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3],
    a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3],
    a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3],
    a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],

    a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7],
    a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7],
    a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7],
    a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],

    a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11],
    a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11],
    a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11],
    a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],

    a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15],
    a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15],
    a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
    a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15],

    a[0] * b[16] + a[4] * b[17] + a[8] * b[18] + a[12] * b[19] + a[16],
    a[1] * b[16] + a[5] * b[17] + a[9] * b[18] + a[13] * b[19] + a[17],
    a[2] * b[16] + a[6] * b[17] + a[10] * b[18] + a[14] * b[19] + a[18],
    a[3] * b[16] + a[7] * b[17] + a[11] * b[18] + a[15] * b[19] + a[19]
  );
}

export class MatA5 {
  constructor(sourceArray) {
    this.array = null;
    if (sourceArray) {
      this.array = sourceArray;
    } else if (typeof Float32Array === 'undefined') {
      this.array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    } else {
      this.array = new Float32Array(20);
    }
  }

  initIdentity() {
    const a = this.array;
    for (let b = 0; b < 20; b += 5) {
      a[b] = 1;
      a[b + 1] = a[b + 2] = a[b + 3] = a[b + 4] = 0;
    }
    return this;
  }

  setColumnMajor(...args /* x20 */) {
    const a = this.array;
    for (let i = 0; i < 20; i++) {
      a[i] = args[i];
    }
    return this;
  }

  setRowMajor(...args /* x20 */) {
    const a = this.array;
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 4; row++) {
        a[col * 4 + row] = args[row * 5 + col];
      }
    }
    return this;
  }

  setDiagonal(x, y, z, w) {
    const a = this.array;
    a[0] = x;
    a[5] = y;
    a[10] = z;
    a[15] = w;
    return this;
  }

  setOffsets(x, y, z, w) {
    const a = this.array;
    a[16] = x;
    a[17] = y;
    a[18] = z;
    a[19] = w;
    return this;
  }

  clone() {
    return new MatA5().setEquals(this);
  }

  toString() {
    const rowStrings = [];
    const row = [0, 0, 0, 0, 0];
    const a = this.array;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 5; j++) {
        row[j] = a[j * 4 + i].toFixed(4);
      }
      rowStrings.push('[ ' + row.join(', ') + ' ]');
    }
    return rowStrings.join('\n');
  }

  /* -------------------------------------------------------------------
   * IN-PLACE OPERATIONS
   * this = this op b
   * ------------------------------------------------------------------- */

  // this = this . b
  multiply(b) {
    return multiply(this, b, this);
  }

  // this = a . this
  premultiply(a) {
    return multiply(a, this, this);
  }

  // this = this ^ -1
  // p.invert = function () {
  // // NO
  // };

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

    for (let i = 0; i < 20; i++) {
      ta[i] = aa[i];
    }
  }

  // this = a . b
  setMultiply(a, b) {
    return multiply(a, b, this);
  }

  // this = a ^ -1
  // p.setInverse = function (a) {
  //  this.setEquals(a);
  //  return this.invert();
  // };

  /* -------------------------------------------------------------------
   * VECTOR FUNCTIONS
   * ------------------------------------------------------------------- */

  multiplyVec4(vin, vout) {
    const a = this.array;
    const vx = vin.x;
    const vy = vin.y;
    const vz = vin.z;
    const vw = vin.w;

    vout.x = a[0] * vx + a[4] * vy + a[8] * vz + a[12] * vw + a[16];
    vout.y = a[1] * vx + a[5] * vy + a[9] * vz + a[13] * vw + a[17];
    vout.z = a[2] * vx + a[6] * vy + a[10] * vz + a[14] * vw + a[18];
    vout.w = a[3] * vx + a[7] * vy + a[11] * vz + a[15] * vw + a[19];
  }

  /* -------------------------------------------------------------------
   * SCALAR FUNCTIONS
   * ------------------------------------------------------------------- */

  det() {
    const m = this.array;
    return det4x4(
      m[0],
      m[4],
      m[8],
      m[12],
      m[1],
      m[5],
      m[9],
      m[13],
      m[2],
      m[6],
      m[10],
      m[14],
      m[3],
      m[7],
      m[11],
      m[15]
    );
  }

  isEqual(other) {
    if (!other) {
      return false;
    }
    const a = this.array;
    const b = other.array;
    for (let i = 0; i < 20; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  isClose(other, epsilon) {
    if (!other) {
      return false;
    }
    const a = this.array;
    const b = other.array;
    let d;
    for (let i = 0; i < 20; i++) {
      d = a[i] - b[i];
      if (d > epsilon || -d > epsilon) {
        return false;
      }
    }
    return true;
  }

  isFinite() {
    const a = this.array;
    for (let i = 0; i < 20; i++) {
      if (!isFinite(a[i])) {
        return false;
      }
    }
    return true;
  }
}
