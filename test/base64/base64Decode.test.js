import { assert } from 'chai';

import { base64Decode } from '../../base64';

function bytes(...byteValues) {
  return new Uint8Array(byteValues);
}

describe('base64#base64Decode()', () => {
  const tests = [
    ['decodes empty strings', '', bytes()],
    ['decodes 1 byte', 'YQ==', bytes(97)],
    ['decodes 2 bytes', 'YWI=', bytes(97, 98)],
    ['decodes 3 bytes', 'YWJj', bytes(97, 98, 99)],
    ['decodes 4 bytes', 'YWJjZA==', bytes(97, 98, 99, 100)],
    ['decodes 5 bytes', 'YWJjZGU=', bytes(97, 98, 99, 100, 101)],
    ['decodes 6 bytes', 'YWJjZGVm', bytes(97, 98, 99, 100, 101, 102)],
    [
      'decodes sequences that could be problematic as text',
      '/v//qgAA3ADYAAE=',
      bytes(0xfe, 0xff, 0xff, 0xaa, 0, 0, 0xdc, 0, 0xd8, 0, 1),
    ],
  ];

  for (const [name, input, expect] of tests) {
    it(name, () => assert.deepEqual(base64Decode(input), expect));
  }
});
