/**
 * @file regex: Regular expression utilities.
 *
 * Well, utility. Right now it only contains `escape`. But we all need `escape`
 * now and then.
 */
const REGEX_META_CHARS = /[$(-+.?[-^{-}]/g;

/**
 * Escapes a string as necessary for RegExp syntax.
 *
 * The resulting string can be used as a regular expression that matches the
 * literal input string.
 *
 * @param {string} literalString - The string to escape.
 * @returns {string} The escaped string.
 */
export function escape(literalString) {
  return String(literalString).replace(REGEX_META_CHARS, '\\$&');
}
