import { assert } from 'chai';

import { unlerp } from '../../math';

describe('math#unlerp()', () => {
  it('works', () => {
    assert.strictEqual(unlerp(-4, 8, -4), 0);
    assert.strictEqual(unlerp(-4, 8, 8), 1);
    assert.strictEqual(unlerp(-4, 8, -1), 0.25);
    assert.strictEqual(unlerp(-4, 8, -16), -1);
    assert.strictEqual(unlerp(-4, 8, 20), 2);
  });
});
