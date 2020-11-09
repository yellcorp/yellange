import { assert } from 'chai';

import { withoutKeys } from '../../dictionary';

describe('dictionary#withoutKeys', () => {
  it('excludes keys in an array', () => {
    const source = { a: 1, b: 2, c: 3, d: 4 };
    assert.deepEqual(withoutKeys(source, ['b', 'c']), { a: 1, d: 4 });
  });

  it('excludes keys in a mapping', () => {
    const source = { a: 1, b: 2, c: 3, d: 4 };
    assert.deepEqual(withoutKeys(source, { a: false, b: true, c: true }), {
      a: 1,
      d: 4,
    });
  });

  it('excludes a single key as a string', () => {
    const source = { a: 1, b: 2, c: 3, d: 4 };
    assert.deepEqual(withoutKeys(source, 'c'), { a: 1, b: 2, d: 4 });
  });

  it('ignores nonexistent properties', () => {
    const source = { a: 1, b: 2, c: 3, d: 4 };
    assert.deepEqual(withoutKeys(source, ['b', 'c', 'x']), { a: 1, d: 4 });
  });

  it('only includes own properties', () => {
    const source = Object.assign(Object.create({ p: 10000 }), {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    });

    assert.deepEqual(withoutKeys(source, ['b', 'c']), { a: 1, d: 4 });
  });
});
