import { assert } from 'chai';

import { stripEnd } from '../../string';

describe('string#stripEnd()', () => {
  it('strips a suffix from the end of a string if present', () => {
    assert.strictEqual(stripEnd('startEnd', 'End'), 'start');
  });

  it("returns the string unmodified if the prefix doesn't match", () => {
    assert.strictEqual(stripEnd('startEnd', 'other'), 'startEnd');
  });

  it('returns the string unmodified if the suffix is zero-length', () => {
    assert.strictEqual(stripEnd('theString', ''), 'theString');
  });

  it('returns a zero-length string if passed a zero-length string', () => {
    assert.strictEqual(stripEnd('', 'End'), '');
  });

  it('converts non-string arguments to strings', () => {
    assert.strictEqual(stripEnd(123789, 789), '123');
  });
});
