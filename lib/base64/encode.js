export function encode(byteArray, alphabet) {
  const len = byteArray.length;
  const pad = alphabet.length === 65 ? alphabet[64] : '';
  let str = '';

  const len3 = len - (len % 3);

  let a, b, c;
  let i = 0;

  // AAAAAA | AA|BBBB | BBBB|CC | CCCCCC
  // WWWWWW | XX XXXX | YYYY YY | ZZZZZZ

  while (i < len3) {
    a = byteArray[i++];
    b = byteArray[i++];
    c = byteArray[i++];

    str +=
      alphabet[a >>> 2] +
      alphabet[((a & 0b11) << 4) | (b >>> 4)] +
      alphabet[((b & 0b1111) << 2) | (c >>> 6)] +
      alphabet[c & 0b111111];
  }

  switch (len - i) {
    case 1:
      a = byteArray[i++];
      str += alphabet[a >>> 2] + alphabet[(a & 0b11) << 4] + pad + pad;
      break;
    case 2:
      a = byteArray[i++];
      b = byteArray[i++];
      str +=
        alphabet[a >>> 2] +
        alphabet[((a & 0b11) << 4) | (b >>> 4)] +
        alphabet[(b & 0b1111) << 2] +
        pad;
      break;
  }

  return str;
}
