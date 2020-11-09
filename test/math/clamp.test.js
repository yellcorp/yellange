import { assert } from 'chai';

import { clamp } from '../../math';

describe('math#clamp()', () => {
  it('works', () => {
    assert.strictEqual(clamp(0, 1, -1), 0);
    assert.strictEqual(clamp(0, 1, 0), 0);
    assert.strictEqual(clamp(0, 1, 0.5), 0.5);
    assert.strictEqual(clamp(0, 1, 1), 1);
    assert.strictEqual(clamp(0, 1, 2), 1);

    assert.strictEqual(clamp(-Infinity, 1, -1), -1);
    assert.strictEqual(clamp(-Infinity, 1, 0), 0);
    assert.strictEqual(clamp(-Infinity, 1, 1), 1);
    assert.strictEqual(clamp(-Infinity, 1, 2), 1);

    assert.strictEqual(clamp(0, Infinity, -1), 0);
    assert.strictEqual(clamp(0, Infinity, 0), 0);
    assert.strictEqual(clamp(0, Infinity, 1), 1);
    assert.strictEqual(clamp(0, Infinity, 2), 2);

    assert.strictEqual(clamp(-Infinity, Infinity, -1), -1);
    assert.strictEqual(clamp(-Infinity, Infinity, 0), 0);
    assert.strictEqual(clamp(-Infinity, Infinity, 1), 1);
    assert.strictEqual(clamp(-Infinity, Infinity, 2), 2);
  });
});
