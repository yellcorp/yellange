import { assert } from 'chai';

import { padStart } from '../../string';

describe('string#padStart()', () => {
  it('pads a string with a repeated single character', () => {
    assert.strictEqual(padStart('A', 5, 'x'), 'xxxxA');
  });

  it("doesn't pad strings that are already the specified length", () => {
    assert.strictEqual(padStart('ABCDE', 5, 'x'), 'ABCDE');
  });

  it("doesn't pad or truncate strings that are longer than the specified length", () => {
    assert.strictEqual(padStart('ABCDEFG', 5, 'x'), 'ABCDEFG');
  });

  it('handles empty subject strings', () => {
    assert.strictEqual(padStart('', 5, 'x'), 'xxxxx');
  });

  it('handles empty pad strings', () => {
    assert.strictEqual(padStart('abc', 5, ''), 'abc');
  });

  it('handles empty subject and pad strings', () => {
    assert.strictEqual(padStart('', 5, ''), '');
  });

  it('converts its arguments to strings', () => {
    assert.strictEqual(padStart(98, 5, 0), '00098');
  });

  it('repeats multi-character padding strings to the specified length', () => {
    assert.strictEqual(padStart('abc', 7, 'xy'), 'xyxyabc');
  });

  it('truncates the end of non-integral repetitions of multi-character padding strings', () => {
    assert.strictEqual(padStart('abc', 10, 'xyz'), 'xyzxyzxabc');
  });
});
