import { Rectangle } from '../geom/rectangle';

/**
 * Finds the minimum bounding box of all non-transparent pixels in an
 * ImageData.
 *
 * A non-transparent pixel is any pixel that has an alpha value greater than 0.
 * The returned Rectangle has its min x/y set to the first non-transparent
 * column/row. Its max is set to the last non-transparent column/row + 1. This
 * ensures the result has correct width and height and can be used with
 * rectangle-based functions of `CanvasRenderingContext2D`.
 *
 * If an image is entirely transparent, the result Rectangle will have its
 * min.x, min.y, max.x and max.y all set to NaN. This case can be detected by
 * {@link Rectangle/isDefined()}, or `isFinite(result.min.x)` returning
 * `false`.
 *
 * @param {ImageData} imageData - The ImageData to survey.
 * @param {Rectangle} [outRectangle] - An optional Rectangle instance in which
 *   to store the results. If not specified, a new Rectangle is constructed. In
 *   either case, the provided or constructed Rectangle is returned.
 * @returns {Rectangle} The bounding box.
 */
export function findAlphaExtents(imageData, outRectangle = null) {
  /* eslint-disable no-labels */
  if (!outRectangle) {
    outRectangle = new Rectangle();
  }

  const width = imageData.width;
  const height = imageData.height;
  const buffer = imageData.data;

  const rowStride = width << 2;

  let xmin, ymin, xmax, ymax, x, y, index, base;

  yminLoop: for (ymin = 0, base = 0; ymin < height; ymin++, base += rowStride) {
    for (x = 0, index = base + 3; x < width; x++, index += 4) {
      if (buffer[index] > 0) {
        break yminLoop;
      }
    }
  }

  if (ymin === height) {
    return outRectangle.clear();
  }

  ymaxLoop: for (
    ymax = height - 1, base = ymax * rowStride;
    ymax >= ymin;
    ymax--, base -= rowStride
  ) {
    for (x = 0, index = base + 3; x < width; x++, index += 4) {
      if (buffer[index] > 0) {
        break ymaxLoop;
      }
    }
  }

  xminLoop: for (
    xmin = 0, base = ymin * rowStride + 3;
    xmin < width;
    xmin++, base += 4
  ) {
    for (y = ymin, index = base; y <= ymax; y++, index += rowStride) {
      if (buffer[index] > 0) {
        break xminLoop;
      }
    }
  }

  xmaxLoop: for (
    xmax = width - 1, base = ymin * rowStride + xmax * 4 + 3;
    xmax >= xmin;
    xmax--, base -= 4
  ) {
    for (y = ymin, index = base; y <= ymax; y++, index += rowStride) {
      if (buffer[index] > 0) {
        break xmaxLoop;
      }
    }
  }

  /* eslint-enable no-labels */
  return outRectangle.setBounds(xmin, ymin, xmax + 1, ymax + 1);
}
