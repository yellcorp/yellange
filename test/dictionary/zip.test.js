import { assert } from 'chai';

import { zip } from '../../dictionary';

describe('dictionary#zip', () => {
  it('creates an object from a key array and a value array', () => {
    assert.deepEqual(zip(['a', 'b'], ['AA', 'BB']), { a: 'AA', b: 'BB' });
  });

  it('uses the length of the key array', () => {
    assert.deepEqual(zip(['a', 'b'], ['AA', 'BB', 'CC']), { a: 'AA', b: 'BB' });

    assert.deepEqual(zip(['a', 'b', 'c'], ['AA', 'BB']), {
      a: 'AA',
      b: 'BB',
      c: undefined,
    });
  });
});
