import { assert } from 'chai';

import { formatColorHex3 } from '../../css/formatcolor';

describe('css#formatColorHex3', () => {
  it('formats a color as a 3-digit hex code', () => {
    assert.equal(formatColorHex3([0xcc, 0xdd, 0xee]), '#cde');
  });

  it('includes leading zeroes', () => {
    assert.equal(formatColorHex3([0x00, 0x00, 0x11]), '#001');
  });
});
