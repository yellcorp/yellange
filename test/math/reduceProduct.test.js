import { assert } from 'chai';

import { reduceProduct } from '../../math';

describe('math#reduceProduct()', () => {
  it('calculates the product of an array', () => {
    assert.strictEqual(reduceProduct([2, 3, 4]), 24);
    assert.strictEqual(reduceProduct([5]), 5);
  });

  it('returns the identity value for an empty array', () => {
    assert.strictEqual(reduceProduct([]), 1);
  });
});
