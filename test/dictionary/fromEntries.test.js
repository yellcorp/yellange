import { assert } from 'chai';

import { fromEntries } from '../../dictionary';

describe('dictionary#fromEntries', () => {
  it('creates an object from an array of entries', () => {
    const entries = [
      ['a', 'AA'],
      ['b', 'BB'],
    ];
    const expect = { a: 'AA', b: 'BB' };

    assert.deepEqual(fromEntries(entries), expect);
  });

  it('creates an empty object from an empty array', () => {
    assert.deepEqual(fromEntries([]), {});
  });

  it('handles numeric properties', () => {
    const entries = [
      [1, 'AA'],
      [2, 'BB'],
    ];
    const expect = { 1: 'AA', 2: 'BB' };

    assert.deepEqual(fromEntries(entries), expect);
  });
});
