import { assert } from 'chai';

import { reduceMax } from '../../math';

describe('math#reduceMax()', () => {
  it('finds the maximum value in an array', () => {
    assert.strictEqual(reduceMax([0, 2, 1]), 2);
    assert.strictEqual(reduceMax([0]), 0);
    assert.strictEqual(
      reduceMax([0, Number.POSITIVE_INFINITY, 1]),
      Number.POSITIVE_INFINITY
    );
    assert.strictEqual(
      reduceMax([Number.POSITIVE_INFINITY]),
      Number.POSITIVE_INFINITY
    );
  });

  it('returns the identity value for an empty array', () => {
    assert.strictEqual(reduceMax([]), Number.NEGATIVE_INFINITY);
  });
});
