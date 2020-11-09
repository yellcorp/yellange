/**
 * @file base64: Base64 to and from Uint8Arrays.
 *
 * You should probably just get something more widely used and tested off npm.
 */

import { decode } from './lib/base64/decode';
import { encode } from './lib/base64/encode';
import { memoize1 } from './memo';

export const COMMON_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const STANDARD_ALPHABET_UNPADDED = COMMON_ALPHABET + '+/';
export const STANDARD_ALPHABET = STANDARD_ALPHABET_UNPADDED + '=';
export const URLSAFE_ALPHABET_UNPADDED = COMMON_ALPHABET + '-_';
export const URLSAFE_ALPHABET = URLSAFE_ALPHABET_UNPADDED + '=';

export function validateAlphabet(alphabet) {
  if (
    !alphabet ||
    typeof alphabet !== 'string' ||
    alphabet.length < 64 ||
    alphabet.length > 65
  ) {
    throw new Error(
      'Base64Coder alphabet must be either 64 or 65 characters in length'
    );
  }
  return alphabet;
}

function _makeDecodeTable(alphabet) {
  const table = new Array(256);

  for (let i = 0; i < 256; i++) {
    table[i] = -1;
  }

  for (let i = 0; i < 64; i++) {
    table[alphabet.charCodeAt(i)] = i;
  }

  return table;
}

const makeDecodeTable = memoize1(_makeDecodeTable);

export class Base64Coder {
  constructor(alphabet = STANDARD_ALPHABET) {
    validateAlphabet(alphabet);

    this._alphabet = alphabet;
    this._decodeTable = null;

    this.decode = this.decode.bind(this);
    this.encode = this.encode.bind(this);
  }

  decode(str, outArray = null) {
    if (!this._decodeTable) {
      this._decodeTable = makeDecodeTable(this._alphabet);
    }
    return decode(str, outArray, this._alphabet, this._decodeTable);
  }

  encode(byteArray) {
    return encode(byteArray, this._alphabet);
  }
}

export function base64Decode(
  str,
  outArray = null,
  alphabet = STANDARD_ALPHABET
) {
  validateAlphabet(alphabet);
  const decodeTable = makeDecodeTable(alphabet);
  return decode(str, outArray, alphabet, decodeTable);
}

export function base64Encode(byteArray, alphabet = STANDARD_ALPHABET) {
  validateAlphabet(alphabet);
  return encode(byteArray, alphabet);
}
