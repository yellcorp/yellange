/**
 * @file math: Simple mathematical functions
 *
 * Mostly motivated by simple, frequent animation and interactivity needs.
 * You'll want a real library for anything more complicated.
 *
 * ## Domain transformation
 * - `clamp`
 * - `floorMod`
 *
 * ## Scalar linear interpolation
 * - `lerp`
 * - `unlerp`
 * - `linearMap`
 * - `linearMapCoefficients`
 *
 * ## Scalar polynomial interpolation
 * - `smoothCubic`
 * - `smoothQuintic`
 * - `unitHermite`
 * - `unitHermiteDerivative`
 *
 * ## Reduction
 * - `reduceMax`
 * - `reduceMin`
 * - `reduceProduct`
 * - `reduceSum`
 */

/**
 * Clamps a number to a range.
 *
 * If the number is less than the minimum, the minimum is returned. If it is
 * greater than the maximum, the maximum is returned. Otherwise, the input
 * number is returned.
 *
 * @param {number} min - The minimum.
 * @param {number} max - The maximum.
 * @param {number} n - The value to clamp.
 * @returns {number} The clamped value.
 */
export function clamp(min, max, n) {
  return n <= min ? min : n >= max ? max : n;
}

/**
 * Returns the remainder of a division, with the quotient calculated as if by
 * flooring, meaning the result has the same sign as the divisor.
 *
 * This is in contrast to JavaScript's `%` operator, which assumes division
 * with truncation, where the result has the sign of the dividend.
 *
 * @param {number} a - The dividend.
 * @param {number} b - The divisor.
 * @returns {number} The remainder of `a / b`.
 */
export function floorMod(a, b) {
  let ans = a % b;

  if (b >= 0 !== ans >= 0) {
    ans += b;
  }
  return ans;
}

/**
 * Calculates a weighted average of two scalar values.
 *
 * @param {number} a - The value represented at x = 0.
 * @param {number} b - The value represented at x = 1.
 * @param {number} x - The weight to use. Returns `a` when set to 0 and `b`
 *   when set to 1. Values between 0 and 1 return an interpolation between `a`
 *   and `b`. Values outside this range return an extrapolation.
 * @returns {number} The weighted average.
 */
export function lerp(a, b, x) {
  return a + (b - a) * x;
}

/**
 * Maps a value in one range to its linear equivalent in another range.
 *
 * Stated differently, this function establishes a linear function given two
 * (x → y) correspondences, and returns the y value of this function for a
 * given x value.
 *
 * @param {number} x0 - The first number defining the input range.
 * @param {number} y0 - The first number defining the output range. When `x`
 *   is `x0`, this value will be returned.
 * @param {number} x1 - The second number defining the input range.
 * @param {number} y1 - The second number defining the output range. When `x`
 *   is `x1`, this value will be returned.
 * @param {number} x - The number to map into the output range.
 * @returns {number} The number in the output range.
 */
export function linearMap(x0, y0, x1, y1, x) {
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

/**
 * Returns the coefficients of a linear mapping from an input range to an
 * output range.
 *
 * Given two (x, y) points, this function finds the values for `m` and
 * `b` for the line `y = m * x + b` passing through them.
 *
 * @param {number} x0 - The first x coordinate.
 * @param {number} y0 - The first y coordinate.
 * @param {number} x1 - The second x coordinate.
 * @param {number} y1 - The second y coordinate.
 * @returns {number[]} A 2-member array, with index 0 containing `m`, the
 *   slope of the line, and index 1 containing `b`, the y-intercept.
 */
export function linearMapCoefficients(x0, y0, x1, y1) {
  const km = (y1 - y0) / (x1 - x0);
  const kb = km * -x0 + y0;

  return [km, kb];
}

/**
 * Finds the maximum value in an array.
 *
 * @param {number[]} a - An array.
 * @returns {number} The maximum value found. For zero-length arrays, -Infinity
 *   is returned, being the identity element for Math.max.
 */
export function reduceMax(a) {
  const len = a.length;
  let acc = -Infinity;

  for (let i = 0; i < len; i++) {
    if (a[i] > acc) {
      acc = a[i];
    }
  }
  return acc;
}

/**
 * Finds the minimum value in an array.
 *
 * @param {number[]} a - An array.
 * @returns {number} The minimum value found. For zero-length arrays, Infinity
 *   is returned, being the identity element for Math.min.
 */
export function reduceMin(a) {
  const len = a.length;
  let acc = Infinity;

  for (let i = 0; i < len; i++) {
    if (a[i] < acc) {
      acc = a[i];
    }
  }
  return acc;
}

/**
 * Multiplies the numbers in an array together.
 *
 * @param {number[]} a - An array.
 * @returns {number} The product of all values in the array. For zero-length
 *   arrays, 1 is returned.
 */
export function reduceProduct(a) {
  const len = a.length;
  let p = 1;
  for (let i = 0; i < len; i++) {
    p *= a[i];
  }
  return p;
}

/**
 * Adds the numbers in an array together.
 *
 * @param {number[]} a - An array.
 * @returns {number} The sum of all values in the array. For zero-length
 *   arrays, 0 is returned.
 */
export function reduceSum(a) {
  const len = a.length;
  let s = 0;
  for (let i = 0; i < len; i++) {
    s += a[i];
  }
  return s;
}

/**
 * Applies a smooth cubic curve to a linear interpolation factor.
 *
 * This function is also known as 'smoothstep'. It returns 0 at 0, and 1 at 1,
 * and has a first derivative of 0 at both these points. It evaluates
 * f(t) = -2 * t^3 + 3 * t^2.
 *
 * @param {number} t - A value in the range 0-1.
 * @returns {number} The smoothed value.
 */
export function smoothCubic(t) {
  return (-2 * t + 3) * t * t;
}

/**
 * Applies a smooth quintic curve to a linear interpolation factor.
 *
 * This function is also known as 'smootherstep'. It returns 0 at 0, and 1 at
 * 1, and has first and second derivatives of 0 at both these points.
 *
 * It evaluates f(t) = 6 * t^5 - 15 * t^4 + 10 * t^3.
 *
 * @param {number} t - A value in the range 0-1.
 * @returns {number} The smoothed value.
 */
export function smoothQuintic(t) {
  return ((6 * t - 15) * t + 10) * t * t * t;
}

/**
 * Calculates Hermite interpolation between two values and their derivatives.
 *
 * The calculation is:
 *   p (2x^3 - 3x^2 + 1)
 * + m (x^3 - 2x^2 + x)
 * + q (3x^2 - 2x^3)
 * + n (x^3 - x^2)
 *
 * Or as a polynomial dot product:
 *   (2p - 2q + n + m)  x^3
 * + (3q - 3p - n - 2m) x^2
 * +          m         x
 * + p
 *
 * @param {number} p - The value at x = 0.
 * @param {number} m - The derivative at x = 0.
 * @param {number} q - The value at x = 1.
 * @param {number} n - The derivative at x = 1.
 * @param {number} x - The interpolation factor between 0 and 1.
 * @returns {number} The interpolated value.
 */
export function unitHermite(p, m, q, n, x) {
  const c3 = 2 * (p - q) + n + m;
  const c2 = 3 * (q - p) - n - 2 * m;

  return ((c3 * x + c2) * x + m) * x + p;
}

/**
 * Calculates the first derivative of Hermite interpolation between two values
 * and their derivatives.
 *
 * The calculation is: (based on the polynomial form of {@link unitHermite})
 *   3 (2p - 2q + n + m)  x^2
 * + 2 (3q - 3p - n - 2m) x
 * + m
 *
 * @param {number} p - The value at x = 0.
 * @param {number} m - The derivative at x = 0.
 * @param {number} q - The value at x = 1.
 * @param {number} n - The derivative at x = 1.
 * @param {number} x - The interpolation factor between 0 and 1.
 * @returns {number} The first derivative of the interpolated value.
 */
export function unitHermiteDerivative(p, m, q, n, x) {
  const c2 = 3 * (2 * (p - q) + n + m);
  const c1 = 2 * (3 * (q - p) - n - 2 * m);

  return (c2 * x + c1) * x + m;
}

/**
 * Calculates the inverse weighted average of two scalar values.
 *
 * This function is the inverse of {@link math/lerp}. In `y = lerp(a, b, x)`,
 * this function finds `x` given `y`.
 *
 * @param {number} a - The value represented at x = 0.
 * @param {number} b - The value represented at x = 1.
 * @param {number} y - The known value.
 * @returns {number} The value `x` such that `lerp(a, b, x)` results in `y`.
 */
export function unlerp(a, b, y) {
  return (y - a) / (b - a);
}
