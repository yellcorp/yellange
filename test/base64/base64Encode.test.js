import { assert } from 'chai';

import { base64Encode } from '../../base64';

describe('base64#base64Encode()', () => {
  const tests = [
    ['encodes empty arrays', [], ''],
    ['encodes 1 byte', [97], 'YQ=='],
    ['encodes 2 bytes', [97, 98], 'YWI='],
    ['encodes 3 bytes', [97, 98, 99], 'YWJj'],
    ['encodes 4 bytes', [97, 98, 99, 100], 'YWJjZA=='],
    ['encodes 5 bytes', [97, 98, 99, 100, 101], 'YWJjZGU='],
    ['encodes 6 bytes', [97, 98, 99, 100, 101, 102], 'YWJjZGVm'],
    [
      'encodes sequences that could be problematic as text',
      [0xfe, 0xff, 0xff, 0xaa, 0, 0, 0xdc, 0, 0xd8, 0, 1],
      '/v//qgAA3ADYAAE=',
    ],
  ];

  for (const [name, input, expect] of tests) {
    it(name, () => assert.strictEqual(base64Encode(input), expect));
  }
});
