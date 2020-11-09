import { assert } from 'chai';

import { repeatToLength } from '../../string';

describe('string#repeatToLength()', () => {
  it('repeats a single-character string', () => {
    assert.strictEqual(repeatToLength('a', 3), 'aaa');
    assert.strictEqual(repeatToLength('a', -3), 'aaa');
  });

  it('repeats a multi-character string to an integral multiple', () => {
    assert.strictEqual(repeatToLength('12', 8), '12121212');
    assert.strictEqual(repeatToLength('12', -8), '12121212');
  });

  it('repeats a multi-character string to a non-integral multiple', () => {
    assert.strictEqual(repeatToLength('abc', 8), 'abcabcab');
  });

  it('repeats a multi-character string to a non-integral multiple, aligning at the end when length is negative', () => {
    assert.strictEqual(repeatToLength('abc', -8), 'bcabcabc');
  });

  it('returns a zero-length string when repeating a zero-length string to any length', () => {
    assert.strictEqual(repeatToLength('', 10), '');
  });

  it('returns a zero-length string when repeating any string to zero length', () => {
    assert.strictEqual(repeatToLength('zyx', 0), '');
  });

  it('converts non-string arguments to strings', () => {
    assert.strictEqual(repeatToLength(456, -10), '6456456456');
  });
});
