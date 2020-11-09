import { assert } from 'chai';

import { formatColor } from '../../css/formatcolor';

describe('css#formatColor', () => {
  it('formats a color as a 3-digit hex code if all channels are an integral multiple of 17', () => {
    assert.equal(formatColor([0xcc, 0xdd, 0xee]), '#cde');
  });

  it('formats a color as a 6-digit hex code if any channel is not an integral multiple of 17', () => {
    assert.equal(formatColor([0xcc, 0xdd, 0xef]), '#ccddef');
  });

  it('formats a color as a 6-digit hex code if no alpha is provided', () => {
    assert.equal(formatColor([0xcd, 0xde, 0xef]), '#cddeef');
  });

  it('formats a color as a 6-digit hex code if alpha is provided and it is 1', () => {
    assert.equal(formatColor([0xcd, 0xde, 0xef, 1]), '#cddeef');
  });

  it('formats a color in rgba function notation if alpha is provided and it is not 1', () => {
    assert.equal(formatColor([64, 128, 192, 0.5]), 'rgba(64, 128, 192, 0.5)');
  });
});
