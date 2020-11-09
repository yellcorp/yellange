function multiply(aw, ax, ay, az, bw, bx, by, bz, out) {
  out.w = aw * bw - ax * bx - ay * by - az * bz;
  out.x = aw * bx + ax * bw + ay * bz - az * by;
  out.y = aw * by - ax * bz + ay * bw + az * bx;
  out.z = aw * bz + ax * by - ay * bx + az * bw;
  return out;
}

// the following functions for log and exp are for unit
// quaternions only!

// in general, ln(Q) is defined as
//   ln abs(Q) + normalize(im(Q)) * acos(re(Q) / abs(Q))

// where
//   re(Q) is the scalar part of quaternion Q
//   im(Q) is the 3-vector part of quaternion Q
//   normalize(v) is v / abs(v)

// this is analogous to the log of complex numbers:
// ln(Z) === ln abs(Z) + i arg(Z)
//   with arg(Z) being
//     atan2(im(Z), re(Z))
//   or equivalently,
//     acos(re(Z) / abs(Z)) [the cah in soh-cah-toa]

// when abs(Q) == 1, i.e. Q is of unit length,
// ln(Q) then becomes

// 0 + normalize(im(Q)) * acos(re(Q))
// 0 shown to emphasize the result has 0 real (scalar) part

// but a rotation Q can also be defined as
//   cos(a) + v sin(a)
// with v being a unit vector

// 0 + normalize(im(Q)) * acos(cos(a))
// 0 + normalize(im(Q)) * a

// im(Q) == v sin(a)
// to normalize im(Q) we divide by its magnitude
// which since v is unit, must be sin(a)
// leaving us with:

// 0 + (im(Q) / sin(a)) * a
// 0 + im(Q) * (a / sin(a))

// a / sin(a) is the reciprocal of the sinc function:
// sin(a) / a, (1 when a == 0)

// which is the code below

function log(q, out) {
  const alpha = Math.acos(q.w);
  const isinc = alpha === 0 ? 1 : alpha / Math.sin(alpha);

  out.w = 0;
  out.x = q.x * isinc;
  out.y = q.y * isinc;
  out.z = q.z * isinc;

  return out;
}

function exp(q, out) {
  const alpha = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
  const isinc = alpha === 0 ? 1 : alpha / Math.sin(alpha);

  out.w = Math.cos(alpha);
  out.x = q.x * isinc;
  out.y = q.y * isinc;
  out.z = q.z * isinc;

  return out;
}

function pow(q, ex, out) {
  if (q.w > -1 && q.w < 1) {
    const alpha = Math.acos(q.w);
    const beta = alpha * ex;
    out.w = Math.cos(beta);

    const xyzFactor = Math.sin(beta) / Math.sin(alpha);
    out.x = q.x * xyzFactor;
    out.y = q.y * xyzFactor;
    out.z = q.z * xyzFactor;
  } else if (q !== out) {
    out.w = q.w;
    out.x = q.x;
    out.y = q.y;
    out.z = q.z;
  }

  return out;
}

function slerp(a, b, t, out) {
  const aw = a.w;
  const ax = a.x;
  const ay = a.y;
  const az = a.z;

  let bw = b.w;
  let bx = b.x;
  let by = b.y;
  let bz = b.z;

  let cosDelta = a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z;

  let u, v;

  if (cosDelta < 0) {
    bw = -bw;
    bx = -bx;
    by = -by;
    bz = -bz;
    cosDelta = -cosDelta;
  }

  if (cosDelta > 0.99999) {
    // will use a linear interpolation if angle delta
    // is close to 0 or 180 degrees
    u = 1 - t;
    v = t;
  } else {
    const sinDelta = Math.sqrt(1 - cosDelta * cosDelta);
    const delta = Math.atan2(sinDelta, cosDelta);
    const invSinDelta = 1 / sinDelta;
    u = Math.sin((1 - t) * delta) * invSinDelta;
    v = Math.sin(t * delta) * invSinDelta;
  }
  out.w = u * aw + v * bw;
  out.x = u * ax + v * bx;
  out.y = u * ay + v * by;
  out.z = u * az + v * bz;

  return out;
}

export class Quaternion {
  constructor(w = 1, x = 0, y = 0, z = 0) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(w, x, y, z) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  initIdentity() {
    this.w = 1;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
  }

  initAxisAngle(u, r) {
    const sh = Math.sin(r / 2);
    this.w = Math.cos(r / 2);
    this.x = sh * u.x;
    this.y = sh * u.y;
    this.z = sh * u.z;
    return this;
  }

  initEulerYXZ(yaw, pitch, roll) {
    const cy = Math.cos(yaw / 2);
    const cp = Math.cos(pitch / 2);
    const cr = Math.cos(roll / 2);
    const sy = Math.sin(yaw / 2);
    const sp = Math.sin(pitch / 2);
    const sr = Math.sin(roll / 2);

    this.w = cy * cp * cr + sy * sp * sr;
    this.x = cy * sp * cr + sy * cp * sr;
    this.y = sy * cp * cr - cy * sp * sr;
    this.z = cy * cp * sr - sy * sp * cr;

    return this;
  }

  initVectorTransform(ua, ub) {
    this.w = 1 + (ua.x * ub.x + ua.y * ub.y + ua.z * ub.z);

    const $ax = ua.x;
    const $ay = ua.y;
    const $az = ua.z;

    const $bx = ub.x;
    const $by = ub.y;
    const $bz = ub.z;

    this.x = $ay * $bz - $az * $by;
    this.y = $az * $bx - $ax * $bz;
    this.z = $ax * $by - $ay * $bx;

    // FIXME: singularity if ua and ub are opposing
    return this.normalize();
  }

  clone() {
    return new Quaternion(this.w, this.x, this.y, this.z);
  }

  toString() {
    return `{ ${this.w} + ${this.x}i + ${this.y}j + {this.z}k }`;
  }

  copyToArray(outArray, offset = 0) {
    outArray[offset] = this.w;
    outArray[offset + 1] = this.x;
    outArray[offset + 2] = this.y;
    outArray[offset + 3] = this.z;
    return this;
  }

  copyFromArray(inArray, offset = 0) {
    this.w = inArray[offset];
    this.x = inArray[offset + 1];
    this.y = inArray[offset + 2];
    this.z = inArray[offset + 3];
    return this;
  }

  /* -------------------------------------------------------------------
   * IN-PLACE OPERATIONS
   * this = this op b
   * ------------------------------------------------------------------- */

  multiply(b) {
    return multiply(this.w, this.x, this.y, this.z, b.w, b.x, b.y, b.z, this);
  }

  premultiply(a) {
    return multiply(a.w, a.x, a.y, a.z, this.w, this.x, this.y, this.z, this);
  }

  negate() {
    this.w = -this.w;
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  conjugate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  normalize() {
    const n =
      1 /
      Math.sqrt(
        this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z
      );
    this.w *= n;
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
  }

  invert() {
    const n =
      1 /
      (this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
    this.w *= n;
    this.x *= -n;
    this.y *= -n;
    this.z *= -n;
    return this;
  }

  log() {
    return log(this, this);
  }

  exp() {
    return exp(this, this);
  }

  pow(ex) {
    return pow(this, ex, this);
  }

  slerp(b, t) {
    return slerp(this, b, t, this);
  }

  scalarMultiply(s) {
    this.w *= s;
    this.x *= s;
    this.y *= s;
    this.z *= s;
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

  setEquals(a) {
    this.w = a.w;
    this.x = a.x;
    this.y = a.y;
    this.z = a.z;
    return this;
  }

  setMultiply(a, b) {
    return multiply(a.w, a.x, a.y, a.z, b.w, b.x, b.y, b.z, this);
  }

  // finds c that satisfies c * a = b
  // this = b * a^-1
  setPreQuotient(a, b) {
    const an = 1 / (a.w * a.w + a.x * a.x + a.y * a.y + a.z * a.z);
    return multiply(
      b.w,
      b.x,
      b.y,
      b.z,
      a.w * an,
      -a.x * an,
      -a.y * an,
      -a.z * an,
      this
    );
  }

  // same as setPreQuotient, but assumes a is already normalized.
  // this allows the result to be calculated with fewer operations.
  setUnitPreQuotient(a, b) {
    return multiply(b.w, b.x, b.y, b.z, a.w, -a.x, -a.y, -a.z, this);
  }

  // finds c that satisfies a * c = b
  // this = a^-1 * b
  setPostQuotient(a, b) {
    const an = 1 / (a.w * a.w + a.x * a.x + a.y * a.y + a.z * a.z);
    return multiply(
      a.w * an,
      -a.x * an,
      -a.y * an,
      -a.z * an,
      b.w,
      b.x,
      b.y,
      b.z,
      this
    );
  }

  // same as setPostQuotient, but assumes a is already normalized.
  setUnitPostQuotient(a, b) {
    return multiply(a.w, -a.x, -a.y, -a.z, b.w, b.x, b.y, b.z, this);
  }

  setNegate(a) {
    this.w = -a.w;
    this.x = -a.x;
    this.y = -a.y;
    this.z = -a.z;
    return this;
  }

  setConjugate(a) {
    this.w = a.w;
    this.x = -a.x;
    this.y = -a.y;
    this.z = -a.z;
    return this;
  }

  setNormalize(a) {
    const n = 1 / Math.sqrt(a.w * a.w + a.x * a.x + a.y * a.y + a.z * a.z);
    this.w = a.w * n;
    this.x = a.x * n;
    this.y = a.y * n;
    this.z = a.z * n;
    return this;
  }

  setInverse(a) {
    const n = -1 / (a.w * a.w + a.x * a.x + a.y * a.y + a.z * a.z);
    this.w = a.w * -n;
    this.x = a.x * n;
    this.y = a.y * n;
    this.z = a.z * n;
    return this;
  }

  setLog(a) {
    return log(a, this);
  }

  setExp(a) {
    return exp(a, this);
  }

  setPow(a, ex) {
    return pow(a, ex, this);
  }

  setSlerp(a, b, t) {
    return slerp(a, b, t, this);
  }

  setScalarMultiply(a, s) {
    this.w = a.w * s;
    this.x = a.x * s;
    this.y = a.y * s;
    this.z = a.z * s;
    return this;
  }

  /* -------------------------------------------------------------------
   * VECTOR FUNCTIONS
   * ------------------------------------------------------------------- */

  transformVec3(vin, vout) {
    const qw = this.w;
    const qx = this.x;
    const qy = this.y;
    const qz = this.z;

    const vx = vin.x;
    const vy = vin.y;
    const vz = vin.z;

    vout.x =
      2 *
      (vx * (0.5 - qy * qy - qz * qz) +
        vy * (qx * qy - qw * qz) +
        vz * (qw * qy + qx * qz));

    vout.y =
      2 *
      (vx * (qx * qy + qw * qz) +
        vy * (0.5 - qx * qx - qz * qz) +
        vz * (qy * qz - qw * qx));

    vout.z =
      2 *
      (vx * (qx * qz - qw * qy) +
        vy * (qw * qx + qy * qz) +
        vz * (0.5 - qx * qx - qy * qy));
  }

  /* -------------------------------------------------------------------
   * SCALAR FUNCTIONS
   * ------------------------------------------------------------------- */

  norm() {
    return Math.sqrt(
      this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z
    );
  }

  normSquared() {
    return (
      this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z
    );
  }

  normReciprocal() {
    return (
      1 /
      Math.sqrt(
        this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z
      )
    );
  }

  dot(b) {
    return this.w * b.w + this.x * b.x + this.y * b.y + this.z * b.z;
  }

  angle() {
    return Math.acos(this.w) * 2;
  }

  axis(outVec3) {
    if (this.w === 1 || this.w === -1) {
      // no rotation, so output 0 vector
      // formula below would output { Inf, Inf, Inf }
      // which would cause NaNs if fed to another
      // axis/angle constructor
      outVec3.x = 0;
      outVec3.y = 0;
      outVec3.z = 0;
    } else {
      const invSinHalfAngle = 1 / Math.sqrt(1 - this.w * this.w);
      outVec3.x = this.x * invSinHalfAngle;
      outVec3.y = this.y * invSinHalfAngle;
      outVec3.z = this.z * invSinHalfAngle;
    }
  }

  isZero() {
    return this.w === 0 && this.x === 0 && this.y === 0 && this.z === 0;
  }

  isFinite() {
    return (
      isFinite(this.w) &&
      isFinite(this.x) &&
      isFinite(this.y) &&
      isFinite(this.z)
    );
  }

  isNearZero(epsilon) {
    return (
      this.w <= epsilon &&
      this.x <= epsilon &&
      this.y <= epsilon &&
      this.z <= epsilon &&
      -this.w <= epsilon &&
      -this.x <= epsilon &&
      -this.y <= epsilon &&
      -this.z <= epsilon
    );
  }

  isEqual(q) {
    if (!q) {
      return false;
    }
    return this.w === q.w && this.x === q.x && this.y === q.y && this.z === q.z;
  }

  isClose(q, epsilon) {
    if (!q) {
      return false;
    }
    let d;
    return (
      (d = this.w - q.w) <= epsilon &&
      -d <= epsilon &&
      (d = this.x - q.x) <= epsilon &&
      -d <= epsilon &&
      (d = this.y - q.y) <= epsilon &&
      -d <= epsilon &&
      (d = this.z - q.z) <= epsilon &&
      -d <= epsilon
    );
  }

  isEquivalent(q) {
    if (!q) {
      return false;
    }
    return (
      this.isEqual(q) ||
      (this.w === -q.w && this.x === -q.x && this.y === -q.y && this.z === -q.z)
    );
  }

  isNearEquivalent(q, epsilon) {
    if (!q) {
      return false;
    }
    let d;
    return (
      this.isClose(q, epsilon) ||
      ((d = this.w + q.w) <= epsilon &&
        -d <= epsilon &&
        (d = this.x + q.y) <= epsilon &&
        -d <= epsilon &&
        (d = this.y + q.z) <= epsilon &&
        -d <= epsilon &&
        (d = this.z + q.w) <= epsilon &&
        -d <= epsilon)
    );
  }
}
