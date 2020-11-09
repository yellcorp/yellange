import { assert } from 'chai';

import { formatColorRGBA } from '../../css/formatcolor';

describe('css#formatColorRGBA', () => {
  it('formats a color in rgba function notation', () => {
    assert.equal(
      formatColorRGBA([64, 128, 192, 0.5]),
      'rgba(64, 128, 192, 0.5)'
    );
  });

  it('assumes an alpha of 1 if the passed array has only 3 elements', () => {
    assert.equal(formatColorRGBA([64, 128, 192]), 'rgba(64, 128, 192, 1)');
  });
});
