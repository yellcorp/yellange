import { assert } from 'chai';

import { floorMod } from '../../math';

describe('math#floorMod()', () => {
  it('behaves like % with positive operands', () => {
    assert.strictEqual(floorMod(6, 3), 0);
    assert.strictEqual(floorMod(10, 3), 1);
    assert.strictEqual(floorMod(14, 3), 2);
  });

  it('calculates remainder as if floor division was used', () => {
    assert.strictEqual(floorMod(-6, 3), 0);
    assert.strictEqual(floorMod(-10, 3), 2);
    assert.strictEqual(floorMod(-14, 3), 1);

    assert.strictEqual(floorMod(6, -3), -3);
    assert.strictEqual(floorMod(10, -3), -2);
    assert.strictEqual(floorMod(14, -3), -1);

    assert.strictEqual(floorMod(-6, -3), -3);
    assert.strictEqual(floorMod(-10, -3), -1);
    assert.strictEqual(floorMod(-14, -3), -2);
  });
});
