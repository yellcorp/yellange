import { assert } from 'chai';

import { stringPathToArray } from '../../dictionary';

describe('dictionary#stringPathToArray', () => {
  it('splits on period', () => {
    assert.deepEqual(stringPathToArray('a.b'), ['a', 'b']);
    assert.deepEqual(stringPathToArray('a'), ['a']);
  });

  it('returns an empty array for an empty string', () => {
    const empty = stringPathToArray('');
    assert.isArray(empty);
    assert.strictEqual(empty.length, 0);
  });
});
