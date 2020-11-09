/**
 * Repeats a string until it is the specified length.
 *
 * The result string will include a partial repetition of the string if the
 * specified length is not an even multiple of the input string's length.
 *
 * The absolute value of the `length` parameter is used. Its sign affects
 * alignment of any partial repetition of the string that may occur. Positive
 * values place the partial start of the input string at the end. Negative
 * values place the partial end of the input string at the start.
 *
 * @param {string} string - The string to repeat.
 * @param {number} length - The length of the result string.
 * @returns {string} The repeated string.
 */
export function repeatToLength(string, length) {
  if (length === 0) {
    return '';
  }

  const str = String(string);
  if (str.length === 0) {
    return '';
  }

  if (str.length === 1) {
    return str.repeat(length > 0 ? length : -length);
  }

  const intRepeat = str.repeat(Math.ceil(Math.abs(length) / str.length));
  return length > 0
    ? intRepeat.slice(0, length)
    : intRepeat.slice(intRepeat.length + length);
}

/**
 * Pads a string to a specified length by appending a repeated string.
 *
 * If the string is the specified length or longer, it is returned unchanged.
 *
 * @param {string} string - The string to pad.
 * @param {number} length - The desired length of the result string.
 * @param {string} [padString= ] - The string to use as padding. It will be
 *   repeated (partially, if necessary) until its length plus the length of
 *   `string` is equal to `length`.
 * @returns {string} The padded string.
 */
export function padEnd(string, length, padString = ' ') {
  const str = String(string);
  if (str.length < length) {
    return str + repeatToLength(padString, length - str.length);
  }
  return str;
}

/**
 * Pads a string to a specified length by prepending a repeated string.
 *
 * If the string is the specified length or longer, it is returned unchanged.
 *
 * @param {string} string - The string to pad.
 * @param {number} length - The desired length of the result string.
 * @param {string} [padString= ] - The string to use as padding. It will be
 *   repeated (partially, if necessary) until its length plus the length of
 *   `string` is equal to `length`.
 * @returns {string} The padded string.
 */
export function padStart(string, length, padString = ' ') {
  const str = String(string);
  if (str.length < length) {
    return repeatToLength(padString, length - str.length) + str;
  }
  return str;
}

/**
 * Internal helper for `partition` and `partitionLast`
 *
 * @param {string} string
 * @param {string} separator
 * @param {number} index
 * @returns {string[]}
 */
function partitionAt(string, separator, index) {
  return index >= 0
    ? [
        string.slice(0, index),
        separator,
        string.slice(index + separator.length),
      ]
    : [string, '', ''];
}

/**
 * Splits a string on the first occurrence of a separator.
 *
 * This function always returns an Array of 3 strings, so that the
 * concatenation of them always results in the input string. If the separator
 * is found, index 0 contains the part of the string before its first
 * occurrence, index 1 contains the separator itself, and index 2 contains the
 * part of the string following it.
 *
 * If the separator is not found, index 0 contains the entire string, and index
 * 1 and 2 contain empty strings.
 *
 * @param {string} string - The string to split.
 * @param {string} separator - The separator to search for.
 * @returns {string[]} The split components of the string.
 */
export function partition(string, separator) {
  const sstr = String(string);
  const ssep = String(separator);
  return partitionAt(sstr, ssep, sstr.indexOf(ssep));
}

/**
 * Splits a string on the last occurrence of a separator.
 *
 * This function always returns an Array of 3 strings, so that the
 * concatenation of them always results in the input string. If the separator
 * is found, index 0 contains the part of the string before its last
 * occurrence, index 1 contains the separator itself, and index 2 contains the
 * part of the string following it.
 *
 * If the separator is not found, index 0 contains the entire string, and index
 * 1 and 2 contain empty strings.
 *
 * @param {string} string - The string to split.
 * @param {string} separator - The separator to search for.
 * @returns {string[]} The split components of the string.
 */
export function partitionLast(string, separator) {
  const sstr = String(string);
  const ssep = String(separator);
  return partitionAt(sstr, ssep, sstr.lastIndexOf(ssep));
}

/**
 * Strips a suffix from a string.
 *
 * If the subject string begins with the specified suffix, the part preceding
 * the suffix will be returned. Otherwise, the whole subject string is
 * returned.
 *
 * @param {string} subject - The string to remove a possible suffix from.
 * @param {string} suffix - The suffix to match.
 * @returns {string} The stripped string.
 */
export function stripEnd(subject, suffix) {
  const str = String(subject);
  const ssuffix = String(suffix);

  if (str.length === 0 || ssuffix.length === 0) {
    return str;
  }

  if (str.endsWith(ssuffix)) {
    return str.slice(0, -ssuffix.length);
  }

  return str;
}

/**
 * Strips a prefix from a string.
 *
 * If the subject string begins with the specified prefix, the part following
 * the prefix will be returned. Otherwise, the whole subject string is
 * returned.
 *
 * @param {string} subject - The string to remove a possible prefix from.
 * @param {string} prefix - The prefix to match.
 * @returns {string} The stripped string.
 */
export function stripStart(subject, prefix) {
  const str = String(subject);
  const sprefix = String(prefix);

  if (str.length === 0 || sprefix.length === 0) {
    return str;
  }

  if (str.startsWith(sprefix)) {
    return str.slice(sprefix.length);
  }

  return str;
}
