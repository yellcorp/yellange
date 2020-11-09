import { assert } from 'chai';

import { formatColorHex6 } from '../../css/formatcolor';

describe('css#formatColorHex6', () => {
  it('formats a color as a 6-digit hex code', () => {
    assert.equal(formatColorHex6([0xab, 0xcd, 0xef]), '#abcdef');
  });

  it('includes leading zeroes', () => {
    assert.equal(formatColorHex6([0x00, 0x00, 0x01]), '#000001');
  });
});
