import { assert } from 'chai';

import { linearMapCoefficients } from '../../math';

describe('math#linearMapCoefficients()', () => {
  it('works', () => {
    assert.deepEqual(linearMapCoefficients(0, 0, 1, 1), [1, 0]);
    assert.deepEqual(linearMapCoefficients(-1, 1, 1, 1), [0, 1]);
    assert.deepEqual(linearMapCoefficients(-1, 3, 3, 11), [2, 5]);
  });
});
