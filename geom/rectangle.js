import { Vec2 } from './vec2';

const ALIGN_LEFT_TOP = new Vec2(0, 0);
const ALIGN_CENTER = new Vec2(0.5, 0.5);

function translate(rect, dx, dy, out) {
  out.min.x = rect.min.x + dx;
  out.min.y = rect.min.y + dy;
  out.max.x = rect.max.x + dx;
  out.max.y = rect.max.y + dy;
  return out;
}

function translateParameterToCoordinates(rect, param, coords, out) {
  const dx = coords.x - (rect.min.x + param.x * (rect.max.x - rect.min.x));
  const dy = coords.t - (rect.min.y + param.y * (rect.max.y - rect.min.y));
  return translate(rect, dx, dy, out);
}

function scaleAroundCoordinates(rect, factor, cx, cy, out) {
  const zLeft = rect.min.x - cx;
  const zTop = rect.min.y - cy;
  const zRight = rect.max.x - cx;
  const zBottom = rect.max.y - cy;

  let fx, fy;
  if (typeof factor === 'number') {
    fx = fy = factor;
  } else {
    fx = factor.x;
    fy = factor.y;
  }

  out.min.x = cx + fx * zLeft;
  out.min.y = cy + fy * zTop;
  out.max.x = cx + fx * zRight;
  out.max.y = cy + fy * zBottom;

  return out;
}

function scaleAroundParameter(rect, factor, tx, ty, out) {
  return scaleAroundCoordinates(
    rect,
    factor,
    rect.min.x + tx * (rect.max.x - rect.min.x),
    rect.min.y + ty * (rect.max.y - rect.min.y),
    out
  );
}

function inflate(rect, edgeDelta, out) {
  let dx, dy;
  if (typeof edgeDelta === 'number') {
    dx = dy = edgeDelta;
  } else {
    dx = edgeDelta.x;
    dy = edgeDelta.y;
  }
  out.min.x = rect.min.x - dx;
  out.min.y = rect.min.y - dy;
  out.max.x = rect.max.x + dx;
  out.max.y = rect.max.y + dy;
  return out;
}

function include(rect, point, out) {
  // these ternaries are phrased 'backwards' to handle the case where a rect's
  // points are NaN, and thus should include the new point unconditionally.
  out.min.x = point.x > rect.min.x ? rect.min.x : point.x;
  out.min.y = point.y > rect.min.y ? rect.min.y : point.y;
  out.max.x = point.x < rect.max.x ? rect.max.x : point.x;
  out.max.y = point.y < rect.max.y ? rect.max.y : point.y;
  return out;
}

function union(a, b, out) {
  out.min.x = a.min.x > b.min.x ? b.min.x : a.min.x;
  out.min.y = a.min.y > b.min.y ? b.min.y : a.min.y;
  out.max.x = a.max.x < b.max.x ? b.max.x : a.max.x;
  out.max.y = a.max.y < b.max.y ? b.max.y : a.max.y;
  return out;
}

function intersect(a, b, out) {
  out.min.x = a.min.x < b.min.x ? b.min.x : a.min.x;
  out.min.y = a.min.y < b.min.y ? b.min.y : a.min.y;
  out.max.x = a.max.x < b.max.x ? b.max.x : a.max.x;
  out.max.y = a.max.y < b.max.y ? b.max.y : a.max.y;

  // if mins are greater than maxes along any axis, there was no overlap.
  // signal such by setting that axis to NaN
  if (out.min.x > out.max.x) {
    out.min.x = out.max.x = NaN;
  }

  if (out.min.y > out.max.y) {
    out.min.y = out.max.y = NaN;
  }

  return out;
}

function lerp(a, b, t, out) {
  out.min.x = a.min.x + t * (b.min.x - a.min.x);
  out.min.y = a.min.y + t * (b.min.y - a.min.y);
  out.max.x = a.max.x + t * (b.max.x - a.max.x);
  out.max.y = a.max.y + t * (b.max.y - a.max.y);
  return out;
}

function round(rect, out) {
  out.min.x = Math.round(rect.min.x);
  out.min.y = Math.round(rect.min.y);
  out.max.x = Math.round(rect.max.x);
  out.max.y = Math.round(rect.max.y);
  return out;
}

function roundOut(rect, out) {
  out.min.x = Math.floor(rect.min.x);
  out.min.y = Math.floor(rect.min.y);
  out.max.x = Math.ceil(rect.max.x);
  out.max.y = Math.ceil(rect.max.y);
  return out;
}

function roundIn(rect, out) {
  out.min.x = Math.ceil(rect.min.x);
  out.min.y = Math.ceil(rect.min.y);
  out.max.x = Math.floor(rect.max.x);
  out.max.y = Math.floor(rect.max.y);
  return out;
}

export class Rectangle {
  constructor(min, max) {
    this.min = new Vec2(NaN, NaN);
    if (min) {
      this.min.setEquals(min);
    }

    this.max = new Vec2(NaN, NaN);
    if (max) {
      this.max.setEquals(max);
    }
  }

  toString() {
    return (
      'Rectangle(min=' +
      this.min.toString() +
      ', max=' +
      this.max.toString() +
      ')'
    );
  }

  clone() {
    return new Rectangle(this.min, this.max);
  }

  /*
   * INTEROP
   * Methods that translate Rectangle instances to and from common plain-Object
   * representations.
   */
  toObjectLTRB(out) {
    if (!out) {
      out = {};
    }
    out.left = this.min.x;
    out.top = this.min.y;
    out.right = this.max.x;
    out.bottom = this.max.y;
    return out;
  }

  toObjectLTWH(out) {
    if (!out) {
      out = {};
    }
    out.left = this.min.x;
    out.top = this.min.y;
    out.width = this.max.x - this.min.x;
    out.height = this.max.y - this.min.y;
    return out;
  }

  toArrayLTRB(out) {
    if (!out) {
      out = [0, 0, 0, 0];
    }
    out[0] = this.min.x;
    out[1] = this.min.y;
    out[2] = this.max.x;
    out[3] = this.max.y;
    return out;
  }

  toArrayLTWH(out) {
    if (!out) {
      out = [0, 0, 0, 0];
    }
    out[0] = this.min.x;
    out[1] = this.min.y;
    out[2] = this.max.x - this.min.x;
    out[3] = this.max.y - this.min.y;
    return out;
  }

  setFromObjectLTRB(object) {
    return this.setBounds(object.left, object.top, object.right, object.bottom);
  }

  setFromObjectLTWH(object) {
    return this.setBounds(
      object.left,
      object.top,
      object.left + object.width,
      object.top + object.height
    );
  }

  setFromArrayLTRB(array) {
    return this.setBounds(array[0], array[1], array[2], array[3]);
  }

  setFromArrayLTWH(array) {
    return this.setBounds(
      array[0],
      array[1],
      array[0] + array[2],
      array[1] + array[3]
    );
  }

  /*
   * SETTERS
   * Methods that change a Rectangle's corners or edges.
   */
  setBounds(left, top, right, bottom) {
    this.min.x = Number(left);
    this.min.y = Number(top);
    this.max.x = Number(right);
    this.max.y = Number(bottom);
    return this;
  }

  setInfinite() {
    return this.setBounds(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY
    );
  }

  setXBounds(left, right) {
    this.min.x = Number(left);
    this.max.x = Number(right);
    return this;
  }

  setXInfinite() {
    return this.setXBounds(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
  }

  setYBounds(top, bottom) {
    this.min.y = Number(top);
    this.max.y = Number(bottom);
    return this;
  }

  setYInfinite() {
    return this.setYBounds(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
  }

  clear() {
    return this.setBounds(NaN, NaN, NaN, NaN);
  }

  set(min, max) {
    return this.setBounds(min.x, min.y, max.x, max.y);
  }

  setFromCorners(corner1, corner2) {
    return this.setBounds(
      Math.min(corner1.x, corner2.x),
      Math.min(corner1.y, corner2.y),
      Math.max(corner1.x, corner2.x),
      Math.max(corner1.y, corner2.y)
    );
  }

  setFromPoints(pointArray) {
    this.clear();
    if (pointArray) {
      for (let i = 0; i < pointArray.length; i++) {
        const point = pointArray[i];

        // goofy and backward to account for the initial NaN state
        if (!(point.x > this.min.x)) {
          this.min.x = point.x;
        }
        if (!(point.y > this.min.y)) {
          this.min.y = point.y;
        }
        if (!(point.x < this.max.x)) {
          this.max.x = point.x;
        }
        if (!(point.y < this.max.y)) {
          this.max.y = point.y;
        }
      }
    }
    return this;
  }

  setFromTopLeftAndSize(tl, size) {
    return this.setFromPointAndSize(tl, size, ALIGN_LEFT_TOP);
  }

  setFromCenterAndSize(center, size) {
    return this.setFromPointAndSize(center, size, ALIGN_CENTER);
  }

  setFromPointAndSize(point, size, align) {
    return this.setBounds(
      point.x - align.x * size.x,
      point.y - align.y * size.y,
      point.x + (1 - align.x) * size.x,
      point.y + (1 - align.y) * size.y
    );
  }

  /*
   * GETTERS
   */
  getWidth() {
    return this.max.x - this.min.x;
  }

  getHeight() {
    return this.max.y - this.min.y;
  }

  getSize(outPoint) {
    if (!outPoint) {
      outPoint = new Vec2();
    }
    outPoint.x = this.max.x - this.min.x;
    outPoint.y = this.max.y - this.min.y;
    return outPoint;
  }

  getArea() {
    return (this.max.x - this.min.x) * (this.max.y - this.min.y);
  }

  getCoordinatesByParameter(parametricPoint, outPoint) {
    if (!outPoint) {
      outPoint = new Vec2();
    }
    outPoint.x = this.min.x + (this.max.x - this.min.x) * parametricPoint.x;
    outPoint.y = this.min.y + (this.max.y - this.min.y) * parametricPoint.y;
    return outPoint;
  }

  getParameterOfCoordinates(coords, outParameter) {
    if (!outParameter) {
      outParameter = new Vec2();
    }
    outParameter.x = (coords.x - this.min.x) / (this.max.x - this.min.x);
    outParameter.y = (coords.y - this.min.y) / (this.max.y - this.min.y);
    return outParameter;
  }

  /*
   * IN-PLACE OPERATORS
   *
   * Operators that take a rectangle and some other operand(s). The instance
   * that the method is called on is used as the first rectangle operand, and
   * is then overwritten with the result.
   *
   * In operator notation, this is analogous to to rectA @= rectB
   */
  translate(delta) {
    return translate(this, delta.x, delta.y, this);
  }

  translateParameterToCoordinates(param, coords) {
    return translateParameterToCoordinates(this, param, coords, this);
  }

  scaleAroundCoordinates(factor, coords) {
    return scaleAroundCoordinates(this, factor, coords.x, coords.y, this);
  }

  scaleAroundParameter(factor, param) {
    return scaleAroundParameter(this, factor, param.x, param.y, this);
  }

  inflate(edgeDelta) {
    return inflate(this, edgeDelta, this);
  }

  include(point) {
    return include(this, point, this);
  }

  union(rectB) {
    return union(this, rectB, this);
  }

  intersect(rectB) {
    return intersect(this, rectB, this);
  }

  lerp(rectB, t) {
    return lerp(this, rectB, t, this);
  }

  round() {
    return round(this, this);
  }

  roundOut() {
    return roundOut(this, this);
  }

  roundIn() {
    return roundIn(this, this);
  }

  /*
   * ASSIGNMENT OPERATORS
   *
   * Operators that take a rectangle and some other operand(s). The instance
   * that the method is called on is used only as storage - it is overwritten
   * with the result. All operands are passed as function parameters.
   *
   * In operator notation, this is analogous to to rectAns = rectA @ rectB
   */
  setEquals(rectA) {
    return this.set(rectA.min, rectA.max);
  }

  setTranslate(rectA, delta) {
    return translate(rectA, delta.x, delta.y, this);
  }

  setTranslateParameterToCoordinates(rectA, param, coords) {
    return translateParameterToCoordinates(rectA, param, coords, this);
  }

  setScaleAroundCoordinates(rectA, factor, coords) {
    return scaleAroundCoordinates(rectA, factor, coords.x, coords.y, this);
  }

  setScaleAroundParameter(rectA, factor, param) {
    return scaleAroundParameter(rectA, factor, param.x, param.y, this);
  }

  setInflate(rectA, edgeDelta) {
    return inflate(rectA, edgeDelta, this);
  }

  setInclude(rectA, point) {
    return include(rectA, point, this);
  }

  setUnion(rectA, rectB) {
    return union(rectA, rectB, this);
  }

  setIntersect(rectA, rectB) {
    return intersect(rectA, rectB, this);
  }

  setLerp(rectA, rectB, t) {
    return lerp(rectA, rectB, t, this);
  }

  setRound(rectA) {
    return round(rectA, this);
  }

  setRoundOut(rectA) {
    return roundOut(rectA, this);
  }

  setRoundIn(rectA) {
    return roundIn(rectA, this);
  }

  /*
   * HETEROGENOUS OPERATORS
   *
   * Operations that return something other than a Rectangle
   */
  clampPoint(inPoint, outPoint) {
    if (!outPoint) {
      outPoint = new Vec2();
    }
    outPoint.x =
      inPoint.x < this.min.x
        ? this.min.x
        : inPoint.x > this.max.x
        ? this.max.x
        : inPoint.x;
    outPoint.y =
      inPoint.y < this.min.y
        ? this.min.y
        : inPoint.y > this.max.y
        ? this.max.y
        : inPoint.y;
    return outPoint;
  }

  /*
   * BOOLEAN QUERIES
   */
  contains(point) {
    if (!point) {
      return false;
    }
    return (
      this.min.x <= point.x &&
      this.min.y <= point.y &&
      this.max.x >= point.x &&
      this.max.y >= point.y
    );
  }

  encloses(rect) {
    if (!rect) {
      return false;
    }
    return (
      this.min.x <= rect.min.x &&
      this.min.y <= rect.min.y &&
      this.max.x >= rect.max.x &&
      this.max.y >= rect.max.y
    );
  }

  intersects(rect) {
    if (!rect) {
      return false;
    }
    return (
      this.min.x <= rect.max.x &&
      this.min.y <= rect.max.y &&
      this.max.x >= rect.min.x &&
      this.max.y >= rect.min.y
    );
  }

  hasNaN() {
    return (
      isNaN(this.min.x) ||
      isNaN(this.min.y) ||
      isNaN(this.max.x) ||
      isNaN(this.max.y)
    );
  }

  isAllNaN() {
    return (
      isNaN(this.min.x) &&
      isNaN(this.min.y) &&
      isNaN(this.max.x) &&
      isNaN(this.max.y)
    );
  }

  isDefined() {
    return !this.hasNaN();
  }

  isFinite() {
    return (
      isFinite(this.min.x) &&
      isFinite(this.min.y) &&
      isFinite(this.max.x) &&
      isFinite(this.max.y)
    );
  }

  isValid() {
    return (
      this.isDefined() && this.max.x >= this.min.x && this.max.y >= this.min.y
    );
  }

  isEqual(rect) {
    if (!rect) return false;
    return (
      this.min.x === rect.min.x &&
      this.min.y === rect.min.y &&
      this.max.x === rect.max.x &&
      this.max.y === rect.max.y
    );
  }

  isClose(rect, epsilon) {
    if (!rect) return false;
    let d;
    return (
      (d = this.min.x - rect.min.x) <= epsilon &&
      -d <= epsilon &&
      (d = this.min.y - rect.min.y) <= epsilon &&
      -d <= epsilon &&
      (d = this.max.x - rect.max.x) <= epsilon &&
      -d <= epsilon &&
      (d = this.max.y - rect.max.y) <= epsilon &&
      -d <= epsilon
    );
  }

  hasZeroArea() {
    return this.min.x === this.max.x || this.min.y === this.max.y;
  }
}

/**
 * Aligns one {@link Rectangle} to another.
 *
 * The returned Rectangle has the same size as `source`, but is positioned
 * relative to `target`.
 *
 * Alignment is expressed by specifying a normalized point for each of `source`
 * and `target`. That is, a point in the range (0-1) where 0 represents the
 * respective rectangle's left or top, and 1 represents the right or bottom.
 * The retruned Rectangle is then a translation of `source` such that these
 * points coincide.
 *
 * For example, if the normalized point for each Rectangle is `{ x: 1, y: 0 }`,
 * the result will be `source`'s top-right corner aligned to `target`'s
 * top-right.
 *
 * If the normalized point for `source` is `{ x: 0.5, y: 1 }` and `target` is
 * `{ x: 0.5, y: 0 }`, `source`'s bottom-center will be aligned to `target`'s
 * top-center.
 *
 * `outRect` is an optional argument. If a Rectangle or similar object is
 * provided, it will be used to contain the result. Otherwise a new Rectangle
 * will be constructed. In either case, the result is returned.
 *
 * @param {Rectangle} source - The rectangle to align. The result will have
 *   this rectangle's size.
 * @param {Vec2} sourceNormPoint - The normalized point in `source` to align.
 * @param {Rectangle} target - The rectangle to align `source` to. The result
 *   will be positioned relative to this rectangle.
 * @param {Vec2} targetNormPoint - The normalized point in `target` to align
 *   `sourceNormPoint` to.
 * @param {Rectangle} [outRect=null] - A Rectangle object in which to place the
 * result.
 * @returns The translated Rectangle. This will be the same object as `outRect`
 *   if it was provided.
 */
export function alignRectangle(
  source,
  sourceNormPoint,
  target,
  targetNormPoint,
  outRect = null
) {
  if (!outRect) {
    outRect = new Rectangle();
  }

  const sourceW = source.max.x - source.min.x;
  const sourceH = source.max.y - source.min.y;
  const targetW = target.max.x - target.min.x;
  const targetH = target.max.y - target.min.y;

  outRect.min.x =
    target.min.x + targetNormPoint.x * targetW - sourceNormPoint.x * sourceW;

  outRect.min.y =
    target.min.y + targetNormPoint.y * targetH - sourceNormPoint.y * sourceH;

  outRect.max.x = outRect.min.x + sourceW;
  outRect.max.y = outRect.min.y + sourceH;

  return outRect;
}

/**
 * Fits one {@link Rectangle} to another by a translate and aspect-preserving
 * scale.
 *
 * The returned Rectangle has the same aspect ratio as `source`, the same
 * center point as `target`, scaled by a factor depending on the following
 * values of `fitMode`:
 *
 * - `"width"`   - The result has the same width as `target`.
 * - `"height"`  - The result has the same height as `target`.
 * - `"contain"` - The result is scaled to fill `target` as much as possible
 *                   without exceeding its bounds.
 * - `"cover"`   - The result is scaled to the minimum size necessary to cover
 *                   all of `target`.
 *
 * `outRect` is an optional argument. If a Rectangle or similar object is
 * provided, it will be used to contain the result. Otherwise a new Rectangle
 * will be constructed. In either case, the result is returned.
 *
 * See {@link alignRectangle} to control alignment of the result rectangle.
 *
 * @param {Rectangle} source - The rectangle to fit. The result will have this
 *   rectangle's aspect ratio.
 * @param {Rectangle} target - The rectangle to fit `source` to. The result
 *   will have this rectangle's center, and at least one of its width or
 *   height.
 * @param {string} fitMode - How the resulting rectangle is scaled. One of
 *   `"width"`, `"height"`, `"contain"`, `"cover"`.
 * @param {Rectangle} [outRect=null] - A Rectangle object in which to place the
 *   result.
 * @returns The translated, scaled Rectangle. This will be the same object as
 *   `outRect` if it was provided.
 */
export function fitRectangle(source, target, fitMode, outRect = null) {
  if (!outRect) {
    outRect = new Rectangle();
  }

  const sourceW = source.max.x - source.min.x;
  const sourceH = source.max.y - source.min.y;
  const targetW = target.max.x - target.min.x;
  const targetH = target.max.y - target.min.y;

  const targetCenterX = target.min.x + targetW * 0.5;
  const targetCenterY = target.min.y + targetH * 0.5;

  const scaleX = targetW / sourceW;
  const scaleY = targetH / sourceH;

  let scale;
  switch (fitMode) {
    case 'width':
      scale = scaleX;
      break;
    case 'height':
      scale = scaleY;
      break;
    case 'cover':
      scale = Math.max(scaleX, scaleY);
      break;
    default:
      scale = Math.min(scaleX, scaleY);
      break;
  }
  scale *= 0.5;

  const halfResultW = sourceW * scale;
  const halfResultH = sourceH * scale;

  outRect.min.x = targetCenterX - halfResultW;
  outRect.min.y = targetCenterY - halfResultH;
  outRect.max.x = targetCenterX + halfResultW;
  outRect.max.y = targetCenterY + halfResultH;

  return outRect;
}

/**
 * Calculates a transform matrix that translates and scales one
 * {@link Rectangle} to another.
 *
 * @param {Rectangle} source - The source rectangle.
 * @param {Rectangle} target - The target rectangle.
 * @param {Mat3} outMatrix3x3 - A matrix object to contain the result.  This
 *   argument must be provided.
 * @returns {Mat3} The resulting transform matrix. The same object as
 *   `outMatrix3x3`.
 */
export function rectangleMapping(source, target, outMatrix3x3) {
  const a = outMatrix3x3.array;

  const scaleX = (target.max.x - target.min.x) / (source.max.x - source.min.x);
  const scaleY = (target.max.y - target.min.y) / (source.max.y - source.min.y);

  a[0] = scaleX;
  a[3] = 0;
  a[6] = target.min.x - scaleX * source.min.x;
  a[1] = 0;
  a[4] = scaleY;
  a[7] = target.min.y - scaleY * source.min.y;
  a[2] = 0;
  a[5] = 0;
  a[8] = 1;

  return outMatrix3x3;
}

const CENTER = new Vec2(0.5, 0.5);
const frmResult = new Rectangle();
/**
 * Calculates a transform matrix that fits and aligns one {@link Rectangle} to
 * another.
 *
 * This is a convenience wrapper around a combination of {@link fitRectangle},
 * optionally {@link alignRectangle}, and {@link rectangleMapping}.
 *
 * @param {Rectangle} source - The source rectangle.
 * @param {Rectangle} target - The target rectangle.
 * @param {string} fitMode - How the scale is calculated. One of `"width"`,
 *   `"height"`, `"contain"`, `"cover"`.  See {@link fitRectangle}.
 * @param options - Options affecting alignment and rounding. Set to `null` to
 *   accept the defaults.
 * @param {Vec2} [options.align] - The alignment of `source` to `target`.  0
 *   aligns left or top edges.  1 aligns right or bottom edges.  Values in
 *   between these extremes interpolate between them.  If omitted,
 *   `{x: 0.5, y: 0.5}` is used, which aligns `source`'s center to `target`'s
 *   center.
 * @param {boolean} [options.round=false] - If `true`, will round the
 *   coordinates of the fitted, aligned rectangle to nearest integers before
 *   calculating the transform matrix.
 * @param {Mat3} outMatrix3x3 - A matrix object to contain the result.  This
 *   argument must be provided.
 * @returns {Mat3} The resulting transform matrix. The same object as
 *   `outMatrix3x3`.
 */
export function fitRectangleMapping(
  source,
  target,
  fitMode,
  options,
  outMatrix3x3
) {
  const alignParam = (options && options.align) || CENTER;
  const rounding = Boolean(options && options.round);

  fitRectangle(source, target, fitMode, frmResult);

  if (alignParam.x !== 0.5 || alignParam.y !== 0.5) {
    alignRectangle(source, alignParam, target, alignParam, frmResult);
  }

  if (rounding) {
    frmResult.round();
  }

  return rectangleMapping(source, frmResult, outMatrix3x3);
}

const tbbCorners = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
/**
 * Transforms the corners of a {@link Rectangle} by a {@link Mat3}, and
 * calculates the bounding box of the transformed corners.
 *
 * @param {Rectangle} inRect - The Rectangle object to transform.
 * @param {Mat3} matrix - The transform to apply.
 * @param {Rectangle} [outRect=null] - A Rectangle object in which to place the
 *   result.
 * @returns The bounding box of `inRect`'s transformed corners. This will be
 *   the same object as `outRect` if it was provided.
 */
export function transformBoundingBox(inRect, matrix, outRect) {
  if (!outRect) {
    outRect = new Rectangle();
  }

  matrix.multiplyVec2(inRect.min, tbbCorners[0]);

  tbbCorners[1].set(inRect.max.x, inRect.min.y);
  matrix.multiplyVec2(tbbCorners[1], tbbCorners[1]);

  matrix.multiplyVec2(inRect.max, tbbCorners[2]);

  tbbCorners[3].set(inRect.min.x, inRect.max.y);
  matrix.multiplyVec2(tbbCorners[3], tbbCorners[3]);

  return outRect.setFromPoints(tbbCorners);
}
