/**
 * @file urlencoding: Environment-independent percent-encoding to and from
 * Uint8Arrays.
 */
import { memoize0 } from './memo';

const getPercentEncodeTable = memoize0(() => {
  const UNRESERVED =
    '-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~';

  const strings = new Array(256);

  let i = 0;
  for (; i < 0x10; i++) {
    strings[i] = '%0' + i.toString(16);
  }

  for (; i < 0x100; i++) {
    strings[i] = '%' + i.toString(16);
  }

  for (i = 0; i < UNRESERVED.length; i++) {
    const code = UNRESERVED.charCodeAt(i);
    strings[code] = UNRESERVED[i];
  }

  return strings;
});

export function urlDecode(string, outArray = null) {
  const percentChunks = string.split('%');

  // length is the input string,
  // less 2 for every percent
  // with 2 readded because a split array has one more element than the
  // number of delimiters found
  let outLen = string.length - percentChunks.length * 2 + 2;

  if (!outArray) {
    outArray = new Uint8Array(outLen);
  } else {
    outLen = Math.min(outLen, outArray.length);
  }

  let i, j, p;
  let chunk = percentChunks[0];
  for (j = 0, p = 0; j < chunk.length && p < outLen; j++, p++) {
    outArray[j] = chunk.charCodeAt(j);
  }

  for (i = 1; i < percentChunks.length && p < outLen; i++) {
    chunk = percentChunks[i];
    outArray[p++] = parseInt(chunk.slice(0, 2), 16);
    for (j = 2; j < chunk.length && p < outLen; j++, p++) {
      outArray[j] = chunk.charCodeAt(j);
    }
  }

  return outArray;
}

export function urlEncode(byteArray) {
  const len = byteArray.length;
  const table = getPercentEncodeTable();
  let str = '';

  for (let i = 0; i < len; i++) {
    str += table[byteArray[i]];
  }

  return str;
}
