import {
  MAX_CODEPOINT,
  REPLACEMENT_CHARACTER,
  codepointToString,
  decodeSurrogatePair,
  isLeadSurrogate,
  isTrailSurrogate,
} from './core';

/**
 * @param {number[]} u8Array
 * @return {string}
 */
export function utf8Decode(u8Array) {
  let string = '';

  let contBytes = 0;
  let codepoint = 0;
  let allowedMin;

  for (let i = 0; i < u8Array.length; i++) {
    const b = u8Array[i];
    if (contBytes === 0) {
      if (b <= 0b01111111) {
        string += String.fromCharCode(b);
      } else if (b <= 0b10111111) {
        // continuation byte only
        string += REPLACEMENT_CHARACTER;
      } else if (b <= 0b11011111) {
        // 110xxxxx 10xxxxxx
        codepoint = b & 0b11111;
        allowedMin = 0x80;
        contBytes = 1;
      } else if (b <= 0b11101111) {
        // 1110xxxx 10xxxxxx 10xxxxxx
        codepoint = b & 0b1111;
        allowedMin = 0x800;
        contBytes = 2;
      } else if (b <= 0b11110111) {
        // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
        codepoint = b & 0b111;
        allowedMin = 0x10000;
        contBytes = 3;
      } else {
        string += REPLACEMENT_CHARACTER;
      }
    } else if (b >= 0b10000000 && b <= 0b10111111) {
      codepoint = (codepoint << 6) | (b & 0b111111);
      if (--contBytes === 0) {
        if (codepoint >= allowedMin && codepoint <= MAX_CODEPOINT) {
          if (codepoint < 0x10000) {
            string += String.fromCharCode(codepoint);
          } else {
            string += codepointToString(codepoint);
          }
        } else {
          string += REPLACEMENT_CHARACTER;
        }
      }
    } else {
      contBytes = 0;
      string += REPLACEMENT_CHARACTER;
      i--;
    }
  }

  if (contBytes > 0) {
    string += REPLACEMENT_CHARACTER;
  }

  return string;
}

/**
 * @param {string} string
 * @return {number[]}
 */
export function utf8Encode(string) {
  const bytes = [];

  for (let i = 0; i < string.length; i++) {
    let c = string.charCodeAt(i);
    if (isLeadSurrogate(c)) {
      const d = string.charCodeAt(i + 1);
      if (isTrailSurrogate(d)) {
        c = decodeSurrogatePair(c, d);
        i++;
      }
    }

    if (c < 0x80) {
      bytes.push(c);
    } else if (c < 0x800) {
      bytes.push(0b11000000 + (c >>> 6), 0b10000000 + (c & 0b111111));
    } else if (c < 0x10000) {
      bytes.push(
        0b11100000 + (c >>> 12),
        0b10000000 + ((c >>> 6) & 0b111111),
        0b10000000 + (c & 0b111111)
      );
    } else {
      bytes.push(
        0b11110000 + (c >>> 18),
        0b10000000 + ((c >>> 12) & 0b111111),
        0b10000000 + ((c >>> 6) & 0b111111),
        0b10000000 + (c & 0b111111)
      );
    }
  }

  return bytes;
}
