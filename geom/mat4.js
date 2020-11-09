// memory layout is column major
// translation values in final column, like OpenGL

// represents a space with its first three columns as basis vectors
// and the last column as origin

//  0  4  8 12 (tx)
//  1  5  9 13 (ty)
//  2  6 10 14 (tz)
//  3  7 11 15 <-- 0 0 0 1 if matrix represents an affine transform

import { Vec3 } from './vec3';
import { det4x4 } from './det4x4';

const workVec3 = [new Vec3(), new Vec3(), new Vec3()];

function multiplyArgsAffine(
  ma,
  b11,
  b12,
  b13,
  b14,
  b21,
  b22,
  b23,
  b24,
  b31,
  b32,
  b33,
  b34,
  out
) {
  const a = ma.array;
  const a11 = a[0];
  const a21 = a[1];
  const a31 = a[2];
  const a41 = a[3];
  const a12 = a[4];
  const a22 = a[5];
  const a32 = a[6];
  const a42 = a[7];
  const a13 = a[8];
  const a23 = a[9];
  const a33 = a[10];
  const a43 = a[11];
  const a14 = a[12];
  const a24 = a[13];
  const a34 = a[14];
  const a44 = a[15];

  const o = out.array;
  o[0] = a11 * b11 + a12 * b21 + a13 * b31;
  o[1] = a21 * b11 + a22 * b21 + a23 * b31;
  o[2] = a31 * b11 + a32 * b21 + a33 * b31;
  o[3] = a41 * b11 + a42 * b21 + a43 * b31;

  o[4] = a11 * b12 + a12 * b22 + a13 * b32;
  o[5] = a21 * b12 + a22 * b22 + a23 * b32;
  o[6] = a31 * b12 + a32 * b22 + a33 * b32;
  o[7] = a41 * b12 + a42 * b22 + a43 * b32;

  o[8] = a11 * b13 + a12 * b23 + a13 * b33;
  o[9] = a21 * b13 + a22 * b23 + a23 * b33;
  o[10] = a31 * b13 + a32 * b23 + a33 * b33;
  o[11] = a41 * b13 + a42 * b23 + a43 * b33;

  o[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14;
  o[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24;
  o[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34;
  o[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44;

  return out;
}

function multiply(ma, mb, out) {
  const a = ma.array;
  const a11 = a[0];
  const a21 = a[1];
  const a31 = a[2];
  const a41 = a[3];
  const a12 = a[4];
  const a22 = a[5];
  const a32 = a[6];
  const a42 = a[7];
  const a13 = a[8];
  const a23 = a[9];
  const a33 = a[10];
  const a43 = a[11];
  const a14 = a[12];
  const a24 = a[13];
  const a34 = a[14];
  const a44 = a[15];

  const b = mb.array;
  const b11 = b[0];
  const b21 = b[1];
  const b31 = b[2];
  const b41 = b[3];
  const b12 = b[4];
  const b22 = b[5];
  const b32 = b[6];
  const b42 = b[7];
  const b13 = b[8];
  const b23 = b[9];
  const b33 = b[10];
  const b43 = b[11];
  const b14 = b[12];
  const b24 = b[13];
  const b34 = b[14];
  const b44 = b[15];

  const o = out.array;
  o[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
  o[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
  o[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
  o[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;

  o[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
  o[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
  o[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
  o[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;

  o[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
  o[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
  o[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
  o[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;

  o[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
  o[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
  o[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
  o[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

  return out;
}

function invertAffine(matrix, invDet) {
  // decompose affine matrix into a product of T, translation
  // and U, upper-left 3x3
  // so if A = TU
  // then
  // A^-1 = U^-1 * T^-1

  const m = matrix.array;
  const m11 = m[0];
  const m21 = m[1];
  const m31 = m[2];
  const m12 = m[4];
  const m22 = m[5];
  const m32 = m[6];
  const m13 = m[8];
  const m23 = m[9];
  const m33 = m[10];
  const x = m[12];
  const y = m[13];
  const z = m[14];

  m[0] = (-m23 * m32 + m22 * m33) * invDet;
  m[1] = (m23 * m31 - m21 * m33) * invDet;
  m[2] = (-m22 * m31 + m21 * m32) * invDet;
  m[4] = (m13 * m32 - m12 * m33) * invDet;
  m[5] = (-m13 * m31 + m11 * m33) * invDet;
  m[6] = (m12 * m31 - m11 * m32) * invDet;
  m[8] = (-m13 * m22 + m12 * m23) * invDet;
  m[9] = (m13 * m21 - m11 * m23) * invDet;
  m[10] = (-m12 * m21 + m11 * m22) * invDet;
  m[12] = m[13] = m[14] = 0;

  return matrix.translate(-x, -y, -z);
}

function invertFull(matrix, invDet) {
  const m = matrix.array;
  const m11 = m[0];
  const m21 = m[1];
  const m31 = m[2];
  const m41 = m[3];
  const m12 = m[4];
  const m22 = m[5];
  const m32 = m[6];
  const m42 = m[7];
  const m13 = m[8];
  const m23 = m[9];
  const m33 = m[10];
  const m43 = m[11];
  const m14 = m[12];
  const m24 = m[13];
  const m34 = m[14];
  const m44 = m[15];

  // 2x2 determinants
  const da = m33 * m44 - m34 * m43;
  const db = m13 * m24 - m14 * m23;
  const dc = m31 * m42 - m32 * m41;
  const dd = m11 * m22 - m12 * m21;
  const de = m32 * m44 - m34 * m42;
  const df = m12 * m24 - m14 * m22;
  const dg = m32 * m43 - m33 * m42;
  const dh = m12 * m23 - m13 * m22;
  const di = m31 * m44 - m34 * m41;
  const dj = m11 * m24 - m14 * m21;
  const dk = m11 * m23 - m13 * m21;
  const dl = m31 * m43 - m33 * m41;

  m[0] = (m22 * da - m23 * de + m24 * dg) * invDet;
  m[1] = -(m21 * da - m23 * di + m24 * dl) * invDet;
  m[2] = (m24 * dc - m22 * di + m21 * de) * invDet;
  m[3] = -(m23 * dc - m22 * dl + m21 * dg) * invDet;
  m[4] = -(m12 * da - m13 * de + m14 * dg) * invDet;
  m[5] = (m11 * da - m13 * di + m14 * dl) * invDet;
  m[6] = -(m14 * dc - m12 * di + m11 * de) * invDet;
  m[7] = (m13 * dc - m12 * dl + m11 * dg) * invDet;
  m[8] = (m42 * db - m43 * df + m44 * dh) * invDet;
  m[9] = -(m41 * db - m43 * dj + m44 * dk) * invDet;
  m[10] = (m44 * dd - m42 * dj + m41 * df) * invDet;
  m[11] = -(m43 * dd - m42 * dk + m41 * dh) * invDet;
  m[12] = -(m32 * db - m33 * df + m34 * dh) * invDet;
  m[13] = (m31 * db - m33 * dj + m34 * dk) * invDet;
  m[14] = -(m34 * dd - m32 * dj + m31 * df) * invDet;
  m[15] = (m33 * dd - m32 * dk + m31 * dh) * invDet;

  return m;
}

export class Mat4 {
  constructor(sourceArray) {
    if (sourceArray) {
      this.array = sourceArray;
    } else if (typeof Float32Array === 'undefined') {
      this.array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    } else {
      this.array = new Float32Array(16);
    }
  }

  initIdentity() {
    const $m = this.array;
    $m[0] = 1;
    $m[1] = 0;
    $m[2] = 0;
    $m[3] = 0;
    $m[4] = 0;
    $m[5] = 1;
    $m[6] = 0;
    $m[7] = 0;
    $m[8] = 0;
    $m[9] = 0;
    $m[10] = 1;
    $m[11] = 0;
    $m[12] = 0;
    $m[13] = 0;
    $m[14] = 0;
    $m[15] = 1;
    return this;
  }

  setColumnMajor(
    m11,
    m21,
    m31,
    m41,
    m12,
    m22,
    m32,
    m42,
    m13,
    m23,
    m33,
    m43,
    m14,
    m24,
    m34,
    m44
  ) {
    const ta = this.array;
    ta[0] = m11;
    ta[1] = m21;
    ta[2] = m31;
    ta[3] = m41;
    ta[4] = m12;
    ta[5] = m22;
    ta[6] = m32;
    ta[7] = m42;
    ta[8] = m13;
    ta[9] = m23;
    ta[10] = m33;
    ta[11] = m43;
    ta[12] = m14;
    ta[13] = m24;
    ta[14] = m34;
    ta[15] = m44;
    return this;
  }

  setRowMajor(
    m11,
    m12,
    m13,
    m14,
    m21,
    m22,
    m23,
    m24,
    m31,
    m32,
    m33,
    m34,
    m41,
    m42,
    m43,
    m44
  ) {
    const ta = this.array;
    ta[0] = m11;
    ta[1] = m21;
    ta[2] = m31;
    ta[3] = m41;
    ta[4] = m12;
    ta[5] = m22;
    ta[6] = m32;
    ta[7] = m42;
    ta[8] = m13;
    ta[9] = m23;
    ta[10] = m33;
    ta[11] = m43;
    ta[12] = m14;
    ta[13] = m24;
    ta[14] = m34;
    ta[15] = m44;
    return this;
  }

  initTranslate(x, y, z) {
    const $m = this.array;
    $m[0] = 1;
    $m[1] = 0;
    $m[2] = 0;
    $m[3] = 0;
    $m[4] = 0;
    $m[5] = 1;
    $m[6] = 0;
    $m[7] = 0;
    $m[8] = 0;
    $m[9] = 0;
    $m[10] = 1;
    $m[11] = 0;
    $m[12] = x;
    $m[13] = y;
    $m[14] = z;
    $m[15] = 1;
    return this;
  }

  initUniformScale(s) {
    const $m = this.array;
    $m[0] = s;
    $m[1] = 0;
    $m[2] = 0;
    $m[3] = 0;
    $m[4] = 0;
    $m[5] = s;
    $m[6] = 0;
    $m[7] = 0;
    $m[8] = 0;
    $m[9] = 0;
    $m[10] = s;
    $m[11] = 0;
    $m[12] = 0;
    $m[13] = 0;
    $m[14] = 0;
    $m[15] = 1;
    return this;
  }

  initNonUniformScale(x, y, z) {
    const $m = this.array;
    $m[0] = x;
    $m[1] = 0;
    $m[2] = 0;
    $m[3] = 0;
    $m[4] = 0;
    $m[5] = y;
    $m[6] = 0;
    $m[7] = 0;
    $m[8] = 0;
    $m[9] = 0;
    $m[10] = z;
    $m[11] = 0;
    $m[12] = 0;
    $m[13] = 0;
    $m[14] = 0;
    $m[15] = 1;
    return this;
  }

  initRotateX(r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);

    const $m = this.array;
    $m[0] = 1;
    $m[1] = 0;
    $m[2] = 0;
    $m[3] = 0;
    $m[4] = 0;
    $m[5] = cr;
    $m[6] = sr;
    $m[7] = 0;
    $m[8] = 0;
    $m[9] = -sr;
    $m[10] = cr;
    $m[11] = 0;
    $m[12] = 0;
    $m[13] = 0;
    $m[14] = 0;
    $m[15] = 1;
    return this;
  }

  initRotateY(r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);

    const $m = this.array;
    $m[0] = cr;
    $m[1] = 0;
    $m[2] = -sr;
    $m[3] = 0;
    $m[4] = 0;
    $m[5] = 1;
    $m[6] = 0;
    $m[7] = 0;
    $m[8] = sr;
    $m[9] = 0;
    $m[10] = cr;
    $m[11] = 0;
    $m[12] = 0;
    $m[13] = 0;
    $m[14] = 0;
    $m[15] = 1;
    return this;
  }

  initRotateZ(r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);

    const $m = this.array;
    $m[0] = cr;
    $m[1] = sr;
    $m[2] = 0;
    $m[3] = 0;
    $m[4] = -sr;
    $m[5] = cr;
    $m[6] = 0;
    $m[7] = 0;
    $m[8] = 0;
    $m[9] = 0;
    $m[10] = 1;
    $m[11] = 0;
    $m[12] = 0;
    $m[13] = 0;
    $m[14] = 0;
    $m[15] = 1;
    return this;
  }

  initRotateAxisAngle(u, r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);
    const vr = 1 - cr;
    const sux = sr * u.x;
    const suy = sr * u.y;
    const suz = sr * u.z;
    const vux = vr * u.x;
    const vuy = vr * u.y;
    const vuz = vr * u.z;

    const $m = this.array;
    $m[0] = cr + u.x * vux;
    $m[1] = u.y * vux + suz;
    $m[2] = u.z * vux - suy;
    $m[3] = 0;
    $m[4] = u.x * vuy - suz;
    $m[5] = cr + u.y * vuy;
    $m[6] = u.z * vuy + sux;
    $m[7] = 0;
    $m[8] = u.x * vuz + suy;
    $m[9] = u.y * vuz - sux;
    $m[10] = cr + u.z * vuz;
    $m[11] = 0;
    $m[12] = 0;
    $m[13] = 0;
    $m[14] = 0;
    $m[15] = 1;

    return this;
  }

  initRotateQuaternion(q) {
    const w = q.w;
    const x = q.x;
    const y = q.y;
    const z = q.z;

    // transposed wrt "3D Math Primer For Graphics And Game Development" as
    // that book uses row vectors (translate values in last row as opposed to
    // last column)
    const $m = this.array;
    $m[0] = 1 - 2 * (y * y + z * z);
    $m[1] = 2 * (x * y + w * z);
    $m[2] = 2 * (x * z - w * y);
    $m[3] = 0;
    $m[4] = 2 * (x * y - w * z);
    $m[5] = 1 - 2 * (x * x + z * z);
    $m[6] = 2 * (y * z + w * x);
    $m[7] = 0;
    $m[8] = 2 * (x * z + w * y);
    $m[9] = 2 * (y * z - w * x);
    $m[10] = 1 - 2 * (x * x + y * y);
    $m[11] = 0;
    $m[12] = 0;
    $m[13] = 0;
    $m[14] = 0;
    $m[15] = 1;

    return this;
  }

  // {x, y, z} is a unit vector normal to the plane of reflection that
  // passes through the origin
  initReflect(x, y, z) {
    const $m = this.array;
    $m[0] = 1 - 2 * x * x;
    $m[1] = -2 * x * y;
    $m[2] = -2 * x * z;
    $m[3] = 0;
    $m[4] = -2 * x * y;
    $m[5] = 1 - 2 * y * y;
    $m[6] = -2 * y * z;
    $m[7] = 0;
    $m[8] = -2 * x * z;
    $m[9] = -2 * y * z;
    $m[10] = 1 - 2 * z * z;
    $m[11] = 0;
    $m[12] = 0;
    $m[13] = 0;
    $m[14] = 0;
    $m[15] = 1;

    return this;
  }

  initLookAt(eye, target, up) {
    // basically a port of gluLookAt, with the guard conditions
    // from threejs thrown in
    const x = workVec3[0];
    const y = workVec3[1];
    const z = workVec3[2];

    const zNorm = z.setSubtract(target, eye).norm();
    if (zNorm === 0) {
      z.z = -1;
    } else {
      z.scale(1 / zNorm);
    }

    const xNorm = x.setCross(z, up).norm();
    if (xNorm === 0) {
      z.x -= 1e-4;
      x.setCross(up, z).normalize();
    } else {
      x.scale(1 / xNorm);
    }

    y.setCross(x, z);

    const $m = this.array;
    $m[0] = x.x;
    $m[1] = y.x;
    $m[2] = -z.x;
    $m[3] = 0;
    $m[4] = x.y;
    $m[5] = y.y;
    $m[6] = -z.y;
    $m[7] = 0;
    $m[8] = x.z;
    $m[9] = y.z;
    $m[10] = -z.z;
    $m[11] = 0;
    $m[12] = 0;
    $m[13] = 0;
    $m[14] = 0;
    $m[15] = 1;

    return this.translate(-eye.x, -eye.y, -eye.z);
  }

  initFrustum(left, right, bottom, top, near, far) {
    // An OpenGL projection frustum
    // i.e. it maps right handed (looking down -Z axis) clip space,
    //   {l, b, n} - {r, t, f}
    // to left handed (looking down +Z axis) normalized device coordinates
    //   {-1, -1, -1} - {1, 1, 1}

    const $m = this.array;
    $m[0] = (2 * near) / (right - left);
    $m[1] = 0;
    $m[2] = 0;
    $m[3] = 0;
    $m[4] = 0;
    $m[5] = (2 * near) / (top - bottom);
    $m[6] = 0;
    $m[7] = 0;
    $m[8] = (right + left) / (right - left);
    $m[9] = (top + bottom) / (top - bottom);
    $m[10] = -(far + near) / (far - near);
    $m[11] = -1;
    $m[12] = 0;
    $m[13] = 0;
    $m[14] = -(2 * far * near) / (far - near);
    $m[15] = 0;

    return this;
  }

  initPerspective(yfov, aspect, near, far) {
    // halve yfov and convert to radians
    const tan = Math.tan(yfov * (3.141592653589793 / 360));
    const halfHeight = near * tan;
    const halfWidth = halfHeight * aspect;

    return this.initFrustum(
      -halfWidth,
      halfWidth,
      -halfHeight,
      halfHeight,
      near,
      far
    );
  }

  initOrthographic(left, right, bottom, top, near, far) {
    // An OpenGL orthographic projection

    const $m = this.array;
    $m[0] = 2 / (right - left);
    $m[1] = 0;
    $m[2] = 0;
    $m[3] = 0;
    $m[4] = 0;
    $m[5] = 2 / (top - bottom);
    $m[6] = 0;
    $m[7] = 0;
    $m[8] = 0;
    $m[9] = 0;
    $m[10] = -2 / (far - near);
    $m[11] = 0;
    $m[12] = -(right + left) / (right - left);
    $m[13] = -(top + bottom) / (top - bottom);
    $m[14] = -(far + near) / (far - near);
    $m[15] = 1;

    return this;
  }

  setTopLeft(mat3) {
    const a = this.array;
    const b = mat3.array;

    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[4] = b[3];
    a[5] = b[4];
    a[6] = b[5];
    a[8] = b[6];
    a[9] = b[7];
    a[10] = b[8];
  }

  clone() {
    return new Mat4().setEquals(this);
  }

  toString() {
    const rows = [];
    const row = [0, 0, 0, 0];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        row[j] = this.array[i + j * 4].toFixed(4);
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
    ta[9] += ba[9];
    ta[10] += ba[10];
    ta[11] += ba[11];
    ta[12] += ba[12];
    ta[13] += ba[13];
    ta[14] += ba[14];
    ta[15] += ba[15];
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
    ta[9] -= ba[9];
    ta[10] -= ba[10];
    ta[11] -= ba[11];
    ta[12] -= ba[12];
    ta[13] -= ba[13];
    ta[14] -= ba[14];
    ta[15] -= ba[15];
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
    ta[9] *= n;
    ta[10] *= n;
    ta[11] *= n;
    ta[12] *= n;
    ta[13] *= n;
    ta[14] *= n;
    ta[15] *= n;
    return this;
  }

  translate(x, y, z) {
    // this is a post-multiply, which means it applies a translation within the
    // space of the matrix defined by 'this', which is why it's not a simple
    // addition to the final column

    // for example, if 'this' represents a rotation, the translation should be
    // aligned to the reoriented axes
    const m = this.array;
    m[12] += x * m[0] + y * m[4] + z * m[8];
    m[13] += x * m[1] + y * m[5] + z * m[9];
    m[14] += x * m[2] + y * m[6] + z * m[10];
    m[15] += x * m[3] + y * m[7] + z * m[11];
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
    ta[6] *= n;
    ta[7] *= n;
    ta[8] *= n;
    ta[9] *= n;
    ta[10] *= n;
    ta[11] *= n;
    return this;
  }

  nonUniformScale(x, y, z) {
    const ta = this.array;
    ta[0] *= x;
    ta[1] *= x;
    ta[2] *= x;
    ta[3] *= x;
    ta[4] *= y;
    ta[5] *= y;
    ta[6] *= y;
    ta[7] *= y;
    ta[8] *= z;
    ta[9] *= z;
    ta[10] *= z;
    ta[11] *= z;
    return this;
  }

  rotateX(r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);
    const m = this.array;

    const a12 = m[4];
    const a22 = m[5];
    const a32 = m[6];
    const a42 = m[7];

    const a13 = m[8];
    const a23 = m[9];
    const a33 = m[10];
    const a43 = m[11];

    m[4] = cr * a12 + sr * a13;
    m[5] = cr * a22 + sr * a23;
    m[6] = cr * a32 + sr * a33;
    m[7] = cr * a42 + sr * a43;

    m[8] = -sr * a12 + cr * a13;
    m[9] = -sr * a22 + cr * a23;
    m[10] = -sr * a32 + cr * a33;
    m[11] = -sr * a42 + cr * a43;

    return this;
  }

  rotateY(r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);
    const m = this.array;

    const a11 = m[0];
    const a21 = m[1];
    const a31 = m[2];
    const a41 = m[3];

    const a13 = m[8];
    const a23 = m[9];
    const a33 = m[10];
    const a43 = m[11];

    m[0] = cr * a11 - sr * a13;
    m[1] = cr * a21 - sr * a23;
    m[2] = cr * a31 - sr * a33;
    m[3] = cr * a41 - sr * a43;

    m[8] = sr * a11 + cr * a13;
    m[9] = sr * a21 + cr * a23;
    m[10] = sr * a31 + cr * a33;
    m[11] = sr * a41 + cr * a43;

    return this;
  }

  rotateZ(r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);
    const m = this.array;

    const a11 = m[0];
    const a21 = m[1];
    const a31 = m[2];
    const a41 = m[3];

    const a12 = m[4];
    const a22 = m[5];
    const a32 = m[6];
    const a42 = m[7];

    m[0] = cr * a11 + sr * a12;
    m[1] = cr * a21 + sr * a22;
    m[2] = cr * a31 + sr * a32;
    m[3] = cr * a41 + sr * a42;

    m[4] = -sr * a11 + cr * a12;
    m[5] = -sr * a21 + cr * a22;
    m[6] = -sr * a31 + cr * a32;
    m[7] = -sr * a41 + cr * a42;

    return this;
  }

  rotateAxisAngle(u, r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);
    const vr = 1 - cr;
    const sux = sr * u.x;
    const suy = sr * u.y;
    const suz = sr * u.z;
    const vux = vr * u.x;
    const vuy = vr * u.y;
    const vuz = vr * u.z;

    return multiplyArgsAffine(
      this,
      cr + u.x * vux,
      u.x * vuy - suz,
      u.x * vuz + suy,
      0,
      u.y * vux + suz,
      cr + u.y * vuy,
      u.y * vuz - sux,
      0,
      u.z * vux - suy,
      u.z * vuy + sux,
      cr + u.z * vuz,
      0,
      this
    );
  }

  rotateQuaternion(q) {
    const w = q.w;
    const x = q.x;
    const y = q.y;
    const z = q.z;

    return multiplyArgsAffine(
      this,
      1 - 2 * (y * y + z * z),
      2 * (x * y - w * z),
      2 * (x * z + w * y),
      0,
      2 * (x * y + w * z),
      1 - 2 * (x * x + z * z),
      2 * (y * z - w * x),
      0,
      2 * (x * z - w * y),
      2 * (y * z + w * x),
      1 - 2 * (x * x + y * y),
      0,
      this
    );
  }

  reflect(x, y, z) {
    return multiplyArgsAffine(
      this,
      1 - 2 * x * x,
      -2 * x * y,
      -2 * x * z,
      0,
      -2 * x * y,
      1 - 2 * y * y,
      -2 * y * z,
      0,
      -2 * x * z,
      -2 * y * z,
      1 - 2 * z * z,
      0,
      this
    );
  }

  // this = this ^ -1
  invert() {
    const m = this.array;
    const invDet = 1 / this.det();

    if (m[3] === 0 && m[7] === 0 && m[11] === 0 && m[15] === 1) {
      return invertAffine(this, invDet);
    }
    return invertFull(this, invDet);
  }

  // this = this ^ T
  transpose() {
    const m = this.array;

    let temp = m[1];
    m[1] = m[4];
    m[4] = temp;

    temp = m[2];
    m[2] = m[8];
    m[8] = temp;

    temp = m[3];
    m[3] = m[12];
    m[12] = temp;

    temp = m[6];
    m[6] = m[9];
    m[9] = temp;

    temp = m[7];
    m[7] = m[13];
    m[13] = temp;

    temp = m[11];
    m[11] = m[14];
    m[14] = temp;

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
    ta[9] = aa[9];
    ta[10] = aa[10];
    ta[11] = aa[11];
    ta[12] = aa[12];
    ta[13] = aa[13];
    ta[14] = aa[14];
    ta[15] = aa[15];

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
    ta[9] = aa[9] + ba[9];
    ta[10] = aa[10] + ba[10];
    ta[11] = aa[11] + ba[11];
    ta[12] = aa[12] + ba[12];
    ta[13] = aa[13] + ba[13];
    ta[14] = aa[14] + ba[14];
    ta[15] = aa[15] + ba[15];
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
    ta[9] = aa[9] - ba[9];
    ta[10] = aa[10] - ba[10];
    ta[11] = aa[11] - ba[11];
    ta[12] = aa[12] - ba[12];
    ta[13] = aa[13] - ba[13];
    ta[14] = aa[14] - ba[14];
    ta[15] = aa[15] - ba[15];
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
    ta[9] = aa[9] * s;
    ta[10] = aa[10] * s;
    ta[11] = aa[11] * s;
    ta[12] = aa[12] * s;
    ta[13] = aa[13] * s;
    ta[14] = aa[14] * s;
    ta[15] = aa[15] * s;
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
    ta[6] = aa[6] * s;
    ta[7] = aa[7] * s;
    ta[8] = aa[8] * s;
    ta[9] = aa[9] * s;
    ta[10] = aa[10] * s;
    ta[11] = aa[11] * s;
    ta[12] = aa[12];
    ta[13] = aa[13];
    ta[14] = aa[14];
    ta[15] = aa[15];
    return this;
  }

  setNonUniformScale(a, x, y, z) {
    const ta = this.array;
    const aa = a.array;
    ta[0] = aa[0] * x;
    ta[1] = aa[1] * x;
    ta[2] = aa[2] * x;
    ta[3] = aa[3] * x;
    ta[4] = aa[4] * y;
    ta[5] = aa[5] * y;
    ta[6] = aa[6] * y;
    ta[7] = aa[7] * y;
    ta[8] = aa[8] * z;
    ta[9] = aa[9] * z;
    ta[10] = aa[10] * z;
    ta[11] = aa[11] * z;
    ta[12] = aa[12];
    ta[13] = aa[13];
    ta[14] = aa[14];
    ta[15] = aa[15];
    return this;
  }

  setRotateX(a, r) {
    this.setEquals(a);
    return this.rotateX(r);
  }

  setRotateY(a, r) {
    this.setEquals(a);
    return this.rotateY(r);
  }

  setRotateZ(a, r) {
    this.setEquals(a);
    return this.rotateZ(r);
  }

  setRotateAxisAngle(a, u, r) {
    const sr = Math.sin(r);
    const cr = Math.cos(r);
    const vr = 1 - cr;
    const sux = sr * u.x;
    const suy = sr * u.y;
    const suz = sr * u.z;
    const vux = vr * u.x;
    const vuy = vr * u.y;
    const vuz = vr * u.z;

    return multiplyArgsAffine(
      a,
      cr + u.x * vux,
      u.x * vuy - suz,
      u.x * vuz + suy,
      0,
      u.y * vux + suz,
      cr + u.y * vuy,
      u.y * vuz - sux,
      0,
      u.z * vux - suy,
      u.z * vuy + sux,
      cr + u.z * vuz,
      0,
      this
    );
  }

  setRotateQuaternion(a, q) {
    const w = q.w;
    const x = q.x;
    const y = q.y;
    const z = q.z;

    return multiplyArgsAffine(
      a,
      1 - 2 * (y * y + z * z),
      2 * (x * y - w * z),
      2 * (x * z + w * y),
      0,
      2 * (x * y + w * z),
      1 - 2 * (x * x + z * z),
      2 * (y * z - w * x),
      0,
      2 * (x * z - w * y),
      2 * (y * z + w * x),
      1 - 2 * (x * x + y * y),
      0,
      this
    );
  }

  setReflect(a, x, y, z) {
    return multiplyArgsAffine(
      a,
      1 - 2 * x * x,
      -2 * x * y,
      -2 * x * z,
      0,
      -2 * x * y,
      1 - 2 * y * y,
      -2 * y * z,
      0,
      -2 * x * z,
      -2 * y * z,
      1 - 2 * z * z,
      0,
      this
    );
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
    m[1] = n[4];
    m[4] = temp;

    temp = n[2];
    m[2] = n[8];
    m[8] = temp;

    temp = n[3];
    m[3] = n[12];
    m[12] = temp;

    m[5] = n[5];

    temp = n[6];
    m[6] = n[9];
    m[9] = temp;

    temp = n[7];
    m[7] = n[13];
    m[13] = temp;

    m[10] = n[10];

    temp = n[11];
    m[11] = n[14];
    m[14] = temp;

    m[15] = n[15];

    return this;
  }

  /* -------------------------------------------------------------------
   * VECTOR FUNCTIONS
   * ------------------------------------------------------------------- */

  multiplyVec3(vin, vout) {
    const a = this.array;
    const ox = vin.x * a[0] + vin.y * a[4] + vin.z * a[8] + a[12];
    const oy = vin.x * a[1] + vin.y * a[5] + vin.z * a[9] + a[13];
    const oz = vin.x * a[2] + vin.y * a[6] + vin.z * a[10] + a[14];
    const ow_1 = 1 / (vin.x * a[3] + vin.y * a[7] + vin.z * a[11] + a[15]);

    vout.x = ox * ow_1;
    vout.y = oy * ow_1;
    vout.z = oz * ow_1;
  }

  multiplyVec4(vin, vout) {
    const a = this.array;
    const vw = Object.prototype.hasOwnProperty.call(vin, 'w') ? vin.w : 1;
    const ox = vin.x * a[0] + vin.y * a[4] + vin.z * a[8] + vw * a[12];
    const oy = vin.x * a[1] + vin.y * a[5] + vin.z * a[9] + vw * a[13];
    const oz = vin.x * a[2] + vin.y * a[6] + vin.z * a[10] + vw * a[14];
    const ow = vin.x * a[3] + vin.y * a[7] + vin.z * a[11] + vw * a[15];

    vout.x = ox;
    vout.y = oy;
    vout.z = oz;
    vout.w = ow;
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

    return (
      a[0] === b[0] &&
      a[1] === b[1] &&
      a[2] === b[2] &&
      a[3] === b[3] &&
      a[4] === b[4] &&
      a[5] === b[5] &&
      a[6] === b[6] &&
      a[7] === b[7] &&
      a[8] === b[8] &&
      a[9] === b[9] &&
      a[10] === b[10] &&
      a[11] === b[11] &&
      a[12] === b[12] &&
      a[13] === b[13] &&
      a[14] === b[14] &&
      a[15] === b[15]
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
      -d <= epsilon &&
      (d = a[9] - b[9]) <= epsilon &&
      -d <= epsilon &&
      (d = a[10] - b[10]) <= epsilon &&
      -d <= epsilon &&
      (d = a[11] - b[11]) <= epsilon &&
      -d <= epsilon &&
      (d = a[12] - b[12]) <= epsilon &&
      -d <= epsilon &&
      (d = a[13] - b[13]) <= epsilon &&
      -d <= epsilon &&
      (d = a[14] - b[14]) <= epsilon &&
      -d <= epsilon &&
      (d = a[15] - b[15]) <= epsilon &&
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
      isFinite(ta[8]) &&
      isFinite(ta[9]) &&
      isFinite(ta[10]) &&
      isFinite(ta[11]) &&
      isFinite(ta[12]) &&
      isFinite(ta[13]) &&
      isFinite(ta[14]) &&
      isFinite(ta[15])
    );
  }
}
