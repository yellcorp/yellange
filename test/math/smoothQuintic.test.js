import { assert } from 'chai';

import { smoothQuintic } from '../../math';

describe('math#smoothQuintic()', () => {
  it('works', () => {
    assert.strictEqual(smoothQuintic(0), 0);
    assert.strictEqual(smoothQuintic(0.25), 0.103515625);
    assert.strictEqual(smoothQuintic(0.5), 0.5);
    assert.strictEqual(smoothQuintic(0.75), 0.896484375);
    assert.strictEqual(smoothQuintic(1), 1);
  });
});
