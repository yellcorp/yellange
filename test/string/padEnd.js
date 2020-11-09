import { assert } from 'chai';

import { padEnd } from '../../string';

describe('string#padEnd()', () => {
  it('pads a string with a repeated single character', () => {
    assert.strictEqual(padEnd('A', 5, 'x'), 'Axxxx');
  });

  it("doesn't pad strings that are already the specified length", () => {
    assert.strictEqual(padEnd('ABCDE', 5, 'x'), 'ABCDE');
  });

  it("doesn't pad or truncate strings that are longer than the specified length", () => {
    assert.strictEqual(padEnd('ABCDEFG', 5, 'x'), 'ABCDEFG');
  });

  it('handles empty subject strings', () => {
    assert.strictEqual(padEnd('', 5, 'x'), 'xxxxx');
  });

  it('handles empty pad strings', () => {
    assert.strictEqual(padEnd('abc', 5, ''), 'abc');
  });

  it('handles empty subject and pad strings', () => {
    assert.strictEqual(padEnd('', 5, ''), '');
  });

  it('converts its arguments to strings', () => {
    assert.strictEqual(padEnd(98, 5, 0), '98000');
  });

  it('repeats multi-character padding strings to the specified length', () => {
    assert.strictEqual(padEnd('abc', 7, 'xy'), 'abcxyxy');
  });

  it('truncates the end of non-integral repetitions of multi-character padding strings', () => {
    assert.strictEqual(padEnd('abc', 10, 'xyz'), 'abcxyzxyzx');
  });
});
