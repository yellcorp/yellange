import { assert } from 'chai';

import { formatColorRGB } from '../../css/formatcolor';

describe('css#formatColorRGB', () => {
  it('formats a color in rgb function notation', () => {
    assert.equal(formatColorRGB([64, 128, 192]), 'rgb(64, 128, 192)');
  });

  it('uses no more than the first 3 elements of the passed array', () => {
    assert.equal(formatColorRGB([64, 128, 192, 1]), 'rgb(64, 128, 192)');
  });
});
