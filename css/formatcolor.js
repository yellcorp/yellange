/**
 * Formats a color in `#RGB` notation.
 *
 * The color is expressed as an array `[ R, G, B ]`, where `R`, `G` and `B`
 * are in the range 0-255. Any extra elements in the array are ignored.
 *
 * Note that unless `R`, `G` and `B` are even multiples of 17, the returned
 * string will be an inexact representation of the color.
 *
 * @param {number[]} rgb - The color to format.
 * @returns {string} The CSS representation of the color.
 */
export function formatColorHex3(rgb) {
  const n =
    ((rgb[0] << 4) & 0xf00) | (rgb[1] & 0x0f0) | ((rgb[2] >>> 4) & 0x00f);
  return '#' + ('00' + n.toString(16)).slice(-3);
}

/**
 * Formats a color in `#RRGGBB` notation.
 *
 * The color is expressed as an array `[ R, G, B ]`, where `R`, `G` and `B`
 * are in the range 0-255. Any extra elements in the array are ignored.
 *
 * @param {number[]} rgb - The color to format.
 * @returns {string} The CSS representation of the color.
 */
export function formatColorHex6(rgb) {
  const n =
    ((rgb[0] << 16) & 0xff0000) |
    ((rgb[1] << 8) & 0x00ff00) |
    (rgb[2] & 0x0000ff);
  return '#' + ('00000' + n.toString(16)).slice(-6);
}

/**
 * Formats a color in `rgb()` notation.
 *
 * The color is expressed as an array `[ R, G, B ]`, where `R`, `G` and `B`
 * are in the range 0-255. Any extra elements in the array are ignored.
 *
 * @param {number[]} rgb - The color to format.
 * @returns {string} The CSS representation of the color.
 */
export function formatColorRGB(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/**
 * Formats a color in `rgba()` notation.
 *
 * The color is expressed as an array `[ R, G, B, A ]`, where `R`, `G` and `B`
 * are in the range 0-255, and `A` is optional and in the range 0-1.
 *
 * If `A` is not present, it is assumed to be 1.
 *
 * @param {number[]} rgba - The color to format.
 * @returns {string} The CSS representation of the color.
 */
export function formatColorRGBA(rgba) {
  return (
    'rgba(' +
    rgba[0] +
    ', ' +
    rgba[1] +
    ', ' +
    rgba[2] +
    ', ' +
    (rgba[3] == null ? 1 : rgba[3]) +
    ')'
  );
}

/**
 * Formats a color in the shortest possible CSS notation.
 *
 * The color is expressed as an array `[ R, G, B, A ]`, where `R`, `G` and `B`
 * are in the range 0-255, and `A` is optional and in the range 0-1.
 *
 * If `A` is present and not 1, the returned string is in `rgba()` notation.
 *
 * Otherwise, if each of `R`, `G` and `B` are even multiples of 17, `#RGB`
 * notation is used.
 *
 * Otherwise, `#RRGGBB` notation is used.
 *
 * @param {number[]} rgba - The color to format.
 * @returns {string} The CSS representation of the color.
 */
export function formatColor(rgba) {
  if (rgba.length > 3 && rgba[3] !== 1) {
    return formatColorRGBA(rgba);
  }

  for (let i = 0; i < 3; i++) {
    if (rgba[i] % 0x11 !== 0) {
      return formatColorHex6(rgba);
    }
  }

  return formatColorHex3(rgba);
}
