import { assert } from 'chai';

import { reduceSum } from '../../math';

describe('math#reduceSum()', () => {
  it('calculates the sum of an array', () => {
    assert.strictEqual(reduceSum([2, 3, 4]), 9);
    assert.strictEqual(reduceSum([5]), 5);
  });

  it('returns the identity value for an empty array', () => {
    assert.strictEqual(reduceSum([]), 0);
  });
});
