import { MatA5 } from '../geom/mata5';
import { channelSetToPresence } from '../lib/raster/channelnotation';

const SQRT3 = Math.sqrt(3);

/**
 * Creates a color matrix that modifies the hue and saturation of pixel values.
 *
 * Conceptually, the 'hue rotation' rotates color space around a normalized
 * axis pointing along [1,1,1] - that is, an axis through every pure grey value
 * in color space. Saturation is modeled as a non-uniform scale in the plane
 * perpendicular to this axis - that is, non-grey values are scaled towards
 * (<1) or away from (>1) the grey axis.
 *
 * @param {number} hue  The hue rotation in radians. (1/3)PI maps red to green
 *   and green to blue. PI maps red to cyan. Multiples of 2PI have no effect.
 * @param {number} sat  Saturation factor. 0 fully desaturates colors. 1 leaves
 *   saturation unmodified. Greater than 1 exaggerates saturation.
 * @param {MatA5|undefined} out  An existing MatA5 instance to store the result
 *   in. This is optional. If none is supplied, a new MatA5 is created and
 *   assigned to this variable. In either case, out is returned.
 * @return {MatA5}
 */
export function hueSaturation(hue, sat, out) {
  let diag, shrp, shrn;

  if (sat !== 0) {
    const cosa = Math.cos(hue);
    const sina = Math.sin(hue);

    sat /= 3;
    const invsat = 1 / 3 - sat;

    diag = sat * (1 + 2 * cosa) + invsat;

    shrp = sat * (1 - cosa - SQRT3 * sina) + invsat;
    shrn = sat * (1 - cosa + SQRT3 * sina) + invsat;
  } else {
    diag = shrp = shrn = 1 / 3;
  }

  if (!out) {
    out = new MatA5();
  }

  // prettier-ignore
  return out.setRowMajor(
    diag,  shrp,  shrn,  0,  0,
    shrn,  diag,  shrp,  0,  0,
    shrp,  shrn,  diag,  0,  0,
    0,     0,     0,     1,  0,
    out
  );
}

/**
 * Creates a color matrix that maps the specified channels according to the
 * parameters of a linear function.
 *
 * This can be used to produce a color matrix that has the same effect as a
 * levels or contrast filter.
 *
 * @param {number[]} coeffs  A pair of numbers `[m, b]` specified as an Array
 *   of length 2. This defines a linear function `f(x) = mx + b`. Arrays of
 *   this type are returned from ./linearfuncs.
 * @param {string} channels  The channels the ColorMatrix should affect.
 *   Defaults to 'rgb', leaving alpha unmodified.
 * @param {MatA5|undefined} out  An existing MatA5 instance to store the result
 *   in. This is optional. If none is supplied, a new MatA5 is created and
 *   assigned to this variable. In either case, out is returned.
 * @return {MatA5}
 */
export function linearFunction(coeffs, channels, out) {
  const ch = channelSetToPresence(channels || 'rgb');
  let [m, b] = coeffs;

  if (!isFinite(m)) {
    m = 1;
  }
  if (!isFinite(b)) {
    b = 0;
  }

  if (!out) {
    out = new MatA5();
  }

  out
    .setDiagonal(ch[0] ? m : 1, ch[1] ? m : 1, ch[2] ? m : 1, ch[3] ? m : 1)
    .setOffsets(ch[0] ? b : 0, ch[1] ? b : 0, ch[2] ? b : 0, ch[3] ? b : 0);

  return out;
}
