import { assert } from 'chai';

import { smoothCubic } from '../../math';

describe('math#smoothCubic()', () => {
  it('works', () => {
    assert.strictEqual(smoothCubic(0), 0);
    assert.strictEqual(smoothCubic(0.125), 0.04296875);
    assert.strictEqual(smoothCubic(0.25), 0.15625);
    assert.strictEqual(smoothCubic(0.5), 0.5);
    assert.strictEqual(smoothCubic(0.75), 0.84375);
    assert.strictEqual(smoothCubic(0.875), 0.95703125);
    assert.strictEqual(smoothCubic(1), 1);
  });
});
