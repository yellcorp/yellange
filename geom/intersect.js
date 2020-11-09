import { Mat3 } from './mat3';
import { Vec2 } from './vec2';

export function scalar(a0, a1, b0, b1) {
  let amin, amax, bmin, bmax;

  if (a0 <= a1) {
    amin = a0;
    amax = a1;
  } else {
    amin = a1;
    amax = a0;
  }

  if (b0 <= b1) {
    bmin = b0;
    bmax = b1;
  } else {
    bmin = b1;
    bmax = b0;
  }
  return amax >= bmin && amin <= bmax;
}

/**
 * tests the intersection of the intervals
 * (a0x,a0y)-(a1x,a0y) and (b0x,b0y)-(b1x,b1y)
 * note that a is constrained parallel to the x axis
 */
export function intervalIntervalX(a0x, a0y, a1x, b0x, b0y, b1x, b1y, out) {
  a1x -= a0x;
  b0x -= a0x;
  b0y -= a0y;
  b1x -= a0x;
  b1y -= a0y;

  // assume this, but 0s have been replaced in the code so these lines
  // don't actually need to run
  // a0x = 0;
  // a0y = 0;

  // system is:
  // [ adx -bdx ] [ ap ] = [ b0x - a0x ]
  // [ ady -bdy ] [ bp ] = [ b0y - a0y ]
  //    coeffs     unks       consts
  //
  // which under the conditions of this func reduces to
  // [ a1x -bdx ] [ ap ] = [ b0x ]
  // [   0 -bdy ] [ bp ] = [ b0y ]
  // find { ap, bp } by cramer's rule

  if (b0y === b1y) {
    // is parallel to comparison-space x-axis
    if (out) {
      out[0] = out[1] = NaN;
    }

    // it is colinear if b0y === 0
    // in which case go on to check the intervals overlap
    return b0y === 0 && scalar(0, a1x, b0x, b1x);
  }

  const bdx = b1x - b0x;
  const bdy = b1y - b0y;
  const icdet = 1 / (a1x * -bdy);

  // find determinants, with some zeroes making this simple
  const ap = (b0x * -bdy - -bdx * b0y) * icdet;
  const bp = a1x * b0y * icdet;

  if (out) {
    out[0] = ap;
    out[1] = bp;
  }
  return ap >= 0 && ap <= 1 && bp >= 0 && bp <= 1;
}

/**
 * tests the intersection of the intervals (a0x,a0y)-(a0x,a1y) and
 * (b0x,b0y)-(b1x,b1y) note that a is constrained parallel to the y axis
 */
export function intervalIntervalY(a0x, a0y, a1y, b0x, b0y, b1x, b1y, out) {
  return intervalIntervalX(-a0y, a0x, -a1y, -b0y, b0x, -b1y, b1x, out);
}

const ap0 = new Vec2();
const ap1 = new Vec2();
const apd = new Vec2();
const bp0 = new Vec2();
const bp1 = new Vec2();
const compSpace = new Mat3();

/**
 * tests the intersection of the intervals
 * (a0x,a0y)-(a1x,a1y) and (b0x,b0y)-(b1x,b1y)
 *
 * returns true for an intersection and places the parametric points of the
 * intersection into the out array, if provided.
 *
 * if a and b are colinear, sets out to [ NaN, NaN ] and returns true.
 *
 * if a and b are parallel, sets out to [ NaN, NaN ] and returns false.
 */
export function intervalInterval(a0x, a0y, a1x, a1y, b0x, b0y, b1x, b1y, out) {
  ap0.set(a0x, a0y);
  ap1.set(a1x, a1y);
  apd.setSubtract(ap1, ap0);

  if (apd.isZero()) {
    out[0] = NaN;
    out[1] = NaN;
    return false;
  }

  bp0.set(b0x, b0y);
  bp1.set(b1x, b1y);

  // this establishes an orthogonal coordinate space that maps the
  // interval a from (a0x, a0y)-(a1x, a1y) to
  // (0, 0)-(|a|^2, 0)

  // so in non-nerd speak it rotates a to be horizontal at y=0
  // but also rotates b the same
  // also it scales as a side-effect but that's ok
  compSpace
    .setRowMajor(apd.x, apd.y, 0, -apd.y, apd.x, 0, 0, 0, 1)
    .translate(-ap0.x, -ap0.y);

  compSpace.multiplyVec2(ap0, ap0);
  compSpace.multiplyVec2(ap1, ap1);
  compSpace.multiplyVec2(bp0, bp0);
  compSpace.multiplyVec2(bp1, bp1);

  return intervalIntervalX(0, 0, ap1.x, bp0.x, bp0.y, bp1.x, bp1.y, out);
}

/**
 * tests the intersection of the interval (b0x,b0y)-(b1x,b1y) with any of the
 * sides of Rectangle r
 */
export function intervalRect(r, b0x, b0y, b1x, b1y) {
  return (
    intervalIntervalX(r.min.x, r.min.y, r.max.x, b0x, b0y, b1x, b1y) ||
    intervalIntervalX(r.min.x, r.max.y, r.max.x, b0x, b0y, b1x, b1y) ||
    intervalIntervalY(r.min.x, r.min.y, r.max.y, b0x, b0y, b1x, b1y) ||
    intervalIntervalY(r.max.x, r.min.y, r.max.y, b0x, b0y, b1x, b1y)
  );
}
