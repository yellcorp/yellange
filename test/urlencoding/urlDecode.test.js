import { assert } from 'chai';

import { urlDecode } from '../../urlencoding';

function bytes(...byteValues) {
  return new Uint8Array(byteValues);
}

describe('urlencoding#urlDecode', () => {
  const tests = [
    ['decodes empty strings', '', bytes()],
    [
      'decodes bytes correctly',
      'Aa%25%20%00%01%2f%0D%0a',
      bytes(0x41, 0x61, 0x25, 0x20, 0x00, 0x01, 0x2f, 0x0d, 0x0a),
    ],
    [
      'decodes percent-less strings',
      'ABCabc01!',
      bytes(0x41, 0x42, 0x43, 0x61, 0x62, 0x63, 0x30, 0x31, 0x21),
    ],
    [
      'decodes percent-only strings',
      '%1F%20%21%40%41%60%61',
      bytes(0x1f, 0x20, 0x21, 0x40, 0x41, 0x60, 0x61),
    ],
    [
      'decodes sequences that could be problematic as text',
      '%Fe%fF%ff%AA%00%00%dc%00%d8%00%01',
      bytes(0xfe, 0xff, 0xff, 0xaa, 0, 0, 0xdc, 0, 0xd8, 0, 1),
    ],
  ];

  for (const [name, input, expect] of tests) {
    it(name, () => assert.deepEqual(urlDecode(input), expect));
  }
});
