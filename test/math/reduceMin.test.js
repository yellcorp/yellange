import { assert } from 'chai';

import { reduceMin } from '../../math';

describe('math#reduceMin()', () => {
  it('finds the minimum value in an array', () => {
    assert.strictEqual(reduceMin([0, 2, 1]), 0);
    assert.strictEqual(reduceMin([0]), 0);
    assert.strictEqual(
      reduceMin([0, Number.NEGATIVE_INFINITY, 1]),
      Number.NEGATIVE_INFINITY
    );
    assert.strictEqual(
      reduceMin([Number.NEGATIVE_INFINITY]),
      Number.NEGATIVE_INFINITY
    );
  });

  it('returns the identity value for an empty array', () => {
    assert.strictEqual(reduceMin([]), Number.POSITIVE_INFINITY);
  });
});
