function findEncodingEnd(str, alphabet) {
  let end = str.length - 1;
  if (alphabet.length === 65) {
    const padChar = alphabet[64];
    let pad = 2;
    while (pad > 0 && str[end] === padChar) {
      end--;
      pad--;
    }
  }
  return end + 1;
}

export function decode(str, outArray, alphabet, decodeTable) {
  const inLen = findEncodingEnd(str, alphabet);
  let outLen = Math.floor(inLen * 0.75) | 0;
  if (!outArray) {
    outArray = new Uint8Array(outLen);
  } else {
    outLen = Math.min(outLen, outArray.length);
  }

  const inLen4 = inLen & -4;

  let w, x, y, z;
  let i = 0;
  let j = 0;
  while (i < inLen4) {
    w = decodeTable[str.charCodeAt(i++)];
    x = decodeTable[str.charCodeAt(i++)];
    y = decodeTable[str.charCodeAt(i++)];
    z = decodeTable[str.charCodeAt(i++)];

    outArray[j++] = (w << 2) | (x >>> 4);
    outArray[j++] = ((x & 0b1111) << 4) | (y >>> 2);
    outArray[j++] = ((y & 0b11) << 6) | z;
  }

  if (i < inLen) {
    w = decodeTable[str.charCodeAt(i++)];
    outArray[j] = w << 2;
  }

  if (i < inLen) {
    x = decodeTable[str.charCodeAt(i++)];
    outArray[j++] |= x >>> 4;
    outArray[j] = (x & 0b1111) << 4;
  }

  if (i < inLen) {
    y = decodeTable[str.charCodeAt(i++)];
    outArray[j++] |= y >>> 2;
    outArray[j] = (y & 0b11) << 6;
  }

  if (i < inLen) {
    outArray[j++] |= decodeTable[str.charCodeAt(i++)];
  }

  return outArray;
}
