import { assert } from 'chai';

import { stripStart } from '../../string';

describe('string#stripStart()', () => {
  it('strips a prefix from the start of a string if present', () => {
    assert.strictEqual(stripStart('startEnd', 'start'), 'End');
  });

  it("returns the string unmodified if the prefix doesn't match", () => {
    assert.strictEqual(stripStart('startEnd', 'other'), 'startEnd');
  });

  it('returns the string unmodified if the prefix is zero-length', () => {
    assert.strictEqual(stripStart('theString', ''), 'theString');
  });

  it('returns a zero-length string if passed a zero-length string', () => {
    assert.strictEqual(stripStart('', 'start'), '');
  });

  it('converts non-string arguments to strings', () => {
    assert.strictEqual(stripStart(123789, 123), '789');
  });
});
