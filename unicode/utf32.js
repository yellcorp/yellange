import {
  MAX_BMP_CODEPOINT,
  MAX_CODEPOINT,
  REPLACEMENT_CHARACTER,
  codepointToString,
  decodeSurrogatePair,
  isLeadSurrogate,
  isTrailSurrogate,
} from './core';

/**
 * @param {number[]} u32Array
 * @return {string}
 */
export function utf32Decode(u32Array) {
  let string = '';
  for (let i = 0; i < u32Array.length; i++) {
    const c = u32Array[i];
    if (c <= MAX_BMP_CODEPOINT) {
      string += String.fromCharCode(c);
    } else if (c <= MAX_CODEPOINT) {
      string += codepointToString(c);
    } else {
      string += REPLACEMENT_CHARACTER;
    }
  }
  return string;
}

/**
 * @param {string} string
 * @return {number[]}
 */
export function utf32Encode(string) {
  const codepoints = [];
  for (let i = 0; i < string.length; i++) {
    const c = string.charCodeAt(i);

    if (isLeadSurrogate(c)) {
      const d = string.charCodeAt(i + 1);
      if (isTrailSurrogate(d)) {
        codepoints.push(decodeSurrogatePair(c, d));
        i++;
        continue;
      }
    }
    codepoints.push(c);
  }
  return codepoints;
}
