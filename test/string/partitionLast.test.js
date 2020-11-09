import { assert } from 'chai';

import { partitionLast } from '../../string';

describe('string#partitionLast()', () => {
  it('works', () => {
    assert.deepEqual(partitionLast('abc', 'b'), ['a', 'b', 'c']);
    assert.deepEqual(partitionLast('abcd', 'bc'), ['a', 'bc', 'd']);
    assert.deepEqual(partitionLast('abcd', 'a'), ['', 'a', 'bcd']);
    assert.deepEqual(partitionLast('abcd', 'd'), ['abc', 'd', '']);
    assert.deepEqual(partitionLast('abcd', 'e'), ['abcd', '', '']);
    assert.deepEqual(partitionLast('', 'e'), ['', '', '']);
  });

  it('converts its arguments to strings', () => {
    assert.deepEqual(partitionLast(1234567, 34), ['12', '34', '567']);
  });

  it('splits on the last occurrence', () => {
    assert.deepEqual(partitionLast('a|b|c|d', '|'), ['a|b|c', '|', 'd']);
  });
});
