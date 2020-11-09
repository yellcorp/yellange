/**
 * @file color: RGB-HSL/HSV conversion
 */

/**
 * Converts a color from HSL to RGB.
 *
 * Colors are expressed as Arrays of 3 numbers. Hues are in the range (0,360) -
 * all others, including red, green and blue, are in the range (0,1).
 *
 * The definition of HSL follows that used in the CSS color spec. At L=0.5
 * (50%), and S=1.0 (100%), the color specified by H is fully saturated.  At
 * L=0 the color is fully black.  At L=1 the color is fully white.
 *
 * @param {number[]} hsl - The color in HSL space.
 * @param {number[]} [rgb=null] - An array to place the result in. If not
 *   provided, a new Array is created.
 * @returns {number[]} The color converted to RGB space. This is the same
 *   object as the `rgb` argument if it was provided.
 */
export function hsl2rgb(hsl, rgb = null) {
  if (!rgb) {
    rgb = [0, 0, 0];
  }

  let h = (hsl[0] / 60) % 6;
  if (h < 0) {
    h += 6;
  }
  const c = (1 - Math.abs(2 * hsl[2] - 1)) * hsl[1];
  const x = c * (1 - Math.abs((h % 2) - 1));

  rgb[0] = rgb[1] = rgb[2] = hsl[2] - 0.5 * c;
  switch (h | 0) {
    case 0:
      rgb[0] += c;
      rgb[1] += x;
      break;
    case 1:
      rgb[0] += x;
      rgb[1] += c;
      break;
    case 2:
      rgb[1] += c;
      rgb[2] += x;
      break;
    case 3:
      rgb[1] += x;
      rgb[2] += c;
      break;
    case 4:
      rgb[2] += c;
      rgb[0] += x;
      break;
    case 5:
      rgb[2] += x;
      rgb[0] += c;
      break;
  }

  return rgb;
}
/**
 * Converts a color from HSV to RGB.
 *
 * Colors are expressed as Arrays of 3 numbers. Hues are in the range (0,360) -
 * all others, including red, green and blue, are in the range (0,1).
 *
 * "HSV" is similar to Photoshop in HSB mode -
 * colors are fully saturated when L=1.0 and S=1.0.
 *
 * @param {number[]} hsv - The color in HSV space.
 * @param {number[]} [rgb=null] - An array to place the result in. If not
 *   provided, a new Array is created.
 * @returns {number[]} The color converted to RGB space. This is the same
 *   object as the `rgb` argument if it was provided.
 */
export function hsv2rgb(hsv, rgb = null) {
  if (!rgb) {
    rgb = [0, 0, 0];
  }

  let h = (hsv[0] / 60) % 6;
  if (h < 0) {
    h += 6;
  }
  const c = hsv[1] * hsv[2];
  const x = c * (1 - Math.abs((h % 2) - 1));

  rgb[0] = rgb[1] = rgb[2] = hsv[2] - c;
  switch (h | 0) {
    case 0:
      rgb[0] += c;
      rgb[1] += x;
      break;
    case 1:
      rgb[0] += x;
      rgb[1] += c;
      break;
    case 2:
      rgb[1] += c;
      rgb[2] += x;
      break;
    case 3:
      rgb[1] += x;
      rgb[2] += c;
      break;
    case 4:
      rgb[2] += c;
      rgb[0] += x;
      break;
    case 5:
      rgb[2] += x;
      rgb[0] += c;
      break;
  }

  return rgb;
}
/**
 * Converts a color from RGB to HSL.
 *
 * Colors are expressed as Arrays of 3 numbers. Hues are in the range (0,360) -
 * all others, including red, green and blue, are in the range (0,1).
 *
 * The definition of HSL follows that used in the CSS color spec. At L=0.5
 * (50%), and S=1.0 (100%), the color specified by H is fully saturated.  At
 * L=0 the color is fully black.  At L=1 the color is fully white.
 *
 * @param {number[]} rgb - The color in RGB space.
 * @param {number[]} [hsl=null] - An array to place the result in. If not
 *   provided, a new Array is created.
 * @returns {number[]} The color converted to HSL space. This is the same
 *   object as the `hsl` argument if it was provided.
 */
export function rgb2hsl(rgb, hsl = null) {
  const [r, g, b] = rgb;
  if (!hsl) {
    hsl = [0, 0, 0];
  }

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const span = max - min;

  if (span > 0) {
    if (max === r) {
      hsl[0] = (60 * (g - b)) / span;
      if (hsl[0] < 0) {
        hsl[0] += 360;
      }
    } else if (max === g) {
      hsl[0] = 60 * ((b - r) / span + 2);
    } else {
      // max === B
      hsl[0] = 60 * ((r - g) / span + 4);
    }
    hsl[2] = (max + min) * 0.5;
    hsl[1] = span / (1 - Math.abs(max + min - 1));
  } else {
    hsl[0] = hsl[1] = 0;
    hsl[2] = max;
  }

  return hsl;
}
/**
 * Converts a color from RGB to HSV.
 *
 * Colors are expressed as Arrays of 3 numbers. Hues are in the range (0,360) -
 * all others, including red, green and blue, are in the range (0,1).
 *
 * "HSV" is similar to Photoshop in HSB mode -
 * colors are fully saturated when L=1.0 and S=1.0.
 *
 * @param {number[]} rgb - The color in RGB space.
 * @param {number[]} [hsv=null] - An array to place the result in. If not
 *   provided, a new Array is created.
 * @returns {number[]} The color converted to HSV space. This is the same
 *   object as the `hsv` argument if it was provided.
 */
export function rgb2hsv(rgb, hsv = null) {
  const [r, g, b] = rgb;
  if (!hsv) {
    hsv = [0, 0, 0];
  }

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const span = max - min;

  if (span > 0) {
    if (max === r) {
      hsv[0] = (60 * (g - b)) / span;
      if (hsv[0] < 0) {
        hsv[0] += 360;
      }
    } else if (max === g) {
      hsv[0] = 60 * ((b - r) / span + 2);
    } else {
      // max === B
      hsv[0] = 60 * ((r - g) / span + 4);
    }
    hsv[1] = span / max;
  } else {
    hsv[0] = hsv[1] = 0;
  }
  hsv[2] = max;

  return hsv;
}
