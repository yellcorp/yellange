import { assert } from 'chai';

import { lerp } from '../../math';

describe('math#lerp()', () => {
  it('works', () => {
    assert.strictEqual(lerp(-4, 8, 0), -4);
    assert.strictEqual(lerp(-4, 8, 1), 8);
    assert.strictEqual(lerp(-4, 8, 0.25), -1);
  });

  it("doesn't clamp the result to the range", () => {
    assert.strictEqual(lerp(-4, 8, -1), -16);
    assert.strictEqual(lerp(-4, 8, 2), 20);
  });
});
