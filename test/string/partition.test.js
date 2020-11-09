import { assert } from 'chai';

import { partition } from '../../string';

describe('string#partition()', () => {
  it('works', () => {
    assert.deepEqual(partition('abc', 'b'), ['a', 'b', 'c']);
    assert.deepEqual(partition('abcd', 'bc'), ['a', 'bc', 'd']);
    assert.deepEqual(partition('abcd', 'a'), ['', 'a', 'bcd']);
    assert.deepEqual(partition('abcd', 'd'), ['abc', 'd', '']);
    assert.deepEqual(partition('abcd', 'e'), ['abcd', '', '']);
    assert.deepEqual(partition('', 'e'), ['', '', '']);
  });

  it('converts its arguments to strings', () => {
    assert.deepEqual(partition(1234567, 34), ['12', '34', '567']);
  });

  it('splits on the first occurrence', () => {
    assert.deepEqual(partition('a|b|c|d', '|'), ['a', '|', 'b|c|d']);
  });
});
