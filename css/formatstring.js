import {
  decodeSurrogatePair,
  isLeadSurrogate,
  isTrailSurrogate,
  REPLACEMENT_CHARACTER,
} from '../unicode/core';

/**
 * Formats a string as a CSS string literal, quoted and escaped appropriately.
 *
 * @param {string} str - The string to format.
 * @param {string} [quote="] - The quote character to use. Must be `"` or `'`.
 * @returns {string} The escaped, quoted string literal
 */
export function formatString(str, quote = '"') {
  str = String(str);
  quote = String(quote || '"').charAt(0);
  const qCode = quote.charCodeAt(0);
  const len = str.length;

  let text = quote;

  // CSS allows variable-length codepoint escapes, but if they're fewer than 6
  // hex digits long, and followed by a literal character that is also a valid
  // hex digit, it needs to be disambiguated by inserting a space. This boolean
  // tracks whether we need to check for such a state.
  let afterShortHexEscape = false;

  for (let pos = 0; pos < len; pos++) {
    let cc = str.charCodeAt(pos);

    if (cc === 0x5c) {
      // backslash
      text += '\\\\';
    } else if (cc === qCode) {
      // the quote character in use
      text += '\\' + quote;
    } else if (
      cc === 0 || // null
      isTrailSurrogate(cc)
    ) {
      // nulls and bare surrogates are explicitly disallowed by the spec, so
      // encode a U+FFFD REPLACEMENT CHARACTER, which is what they'd roundtrip
      // as
      text += REPLACEMENT_CHARACTER;
    } else if (cc < 0x20 || cc === 0x7f) {
      // control codes
      text += '\\' + cc.toString(16);
      afterShortHexEscape = cc < 0x100000;
    } else if (isLeadSurrogate(cc)) {
      // always hex-escape astral plane characters
      let trail;
      if (pos + 1 === len) {
        // we hit the end of the string early in the middle of a surrogate
        // pair. set up a deliberate decode failure so we can just have the one
        // code path
        trail = 0;
      } else {
        trail = str.charCodeAt(pos + 1);
      }

      cc = decodeSurrogatePair(cc, trail);
      if (cc >= 0) {
        pos++;
        text += '\\' + cc.toString(16);
        afterShortHexEscape = cc < 0x100000;
      } else {
        text += REPLACEMENT_CHARACTER;
      }
    } else {
      if (afterShortHexEscape) {
        if (
          (cc >= 0x30 && cc <= 0x39) ||
          (cc >= 0x41 && cc <= 0x46) ||
          (cc >= 0x61 && cc <= 0x66)
        ) {
          text += ' ';
        }
        afterShortHexEscape = false;
      }
      text += str[pos];
    }
  }

  return text + quote;
}

/**
 * Formats a URL as a CSS url() expression.
 *
 * @param {string} url - The URL to format.
 * @param {string} [quote="] - The quote character to use. Must be `"` or `'`.
 * @returns {string} The escaped, quoted URL in a url() expression.
 */
export function formatUrl(url, quote = '"') {
  return 'url(' + formatString(url, quote) + ')';
}
