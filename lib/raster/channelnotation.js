/**
 * Returns the channel index for a channel specifier.
 *
 * A channel specifier can be one of:
 * - A single character string: 'r', 'g', 'b' or 'a', or the uppercase
 *   equivalent.
 * - The channel index as an integer in the range [0, 3].
 * - The channel index as a single character string: '0', '1', '2' or '3'.
 *
 * @param {string|number} channelChar
 * @return {number}
 */
export function channelToIndex(channelChar) {
  switch (channelChar) {
    case 'r':
    case 'R':
    case '0':
    case 0:
      return 0;
    case 'g':
    case 'G':
    case '1':
    case 1:
      return 1;
    case 'b':
    case 'B':
    case '2':
    case 2:
      return 2;
    case 'a':
    case 'A':
    case '3':
    case 3:
      return 3;
  }

  throw new Error(
    "Invalid channel character '" +
      channelChar +
      "'. Valid channels are r, g, b, a or an integer in the range 0-3"
  );
}

/**
 * Converts a channel set to an array of channel indices.
 *
 * A channel set is a string or array nominating a set of color channels. For
 * example, `"RGBA"` nominates all four channels of a 32-bit RGBA image, and
 * thus returns `[0, 1, 2, 3]`. `"A"` alone nominates only the alpha channel,
 * and returns `[3]`. `"RG"` nominates only the red and green channels, and
 * returns `[0, 1]`.
 *
 * See `channelToIndex` for accepted channel names. The following examples all
 * return `[0, 1, 2, 3]`:
 *
 * ```
 * "RGBA"
 * "0123"
 * "r1bA"
 * [ "r", "g", "b", "a" ]
 * [ "0", "G", 2, "A" ]
 * ```
 *
 * @param {string|Array<string|number>} channelSet
 * @return {number[]}
 */
export function channelSetToIndices(channelSet) {
  const indices = [];
  for (let i = 0; i < channelSet.length; i++) {
    indices.push(channelToIndex(channelSet[i]));
  }
  return indices;
}

/**
 * Converts a channel set to an array `a` of four booleans, where `a[i]` is true
 * if channel index `i` was nominated by the channel set.
 *
 * For example:
 * `"RGBA"` -> `[true,  true,  true,  true]`
 * `"A"`    -> `[false, false, false, true]`
 * `"RG"`   -> `[true,  true,  false, false]`
 *
 * The channel set syntax used by `channelSetToIndices` is recognized here as
 * well.
 *
 * @param {string|Array<string|number>} channelSet
 * @return {boolean[]}
 */
export function channelSetToPresence(channelSet) {
  const presence = [false, false, false, false];
  const indices = channelSetToIndices(channelSet);

  for (let i = 0; i < indices.length; i++) {
    presence[indices[i]] = true;
  }

  return presence;
}
