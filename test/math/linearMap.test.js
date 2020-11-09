import { assert } from 'chai';

import { linearMap } from '../../math';

describe('math#linearMap()', () => {
  it('works', () => {
    assert.strictEqual(linearMap(-2, 1, 2, 3, -2), 1);
    assert.strictEqual(linearMap(-2, 1, 2, 3, 2), 3);
    assert.strictEqual(linearMap(-2, 1, 2, 3, 0), 2);
  });

  it("doesn't clamp the result to the range", () => {
    assert.strictEqual(linearMap(-2, 1, 2, 3, -4), 0);
    assert.strictEqual(linearMap(-2, 1, 2, 3, 4), 4);
  });
});
