import { assert } from 'chai';

import { onlyKeys } from '../../dictionary';

describe('dictionary#onlyKeys', () => {
  it('includes keys in an array', () => {
    const source = { a: 1, b: 2, c: 3, d: 4 };
    assert.deepEqual(onlyKeys(source, ['b', 'c']), { b: 2, c: 3 });
  });

  it('includes keys in a mapping', () => {
    const source = { a: 1, b: 2, c: 3, d: 4 };
    assert.deepEqual(onlyKeys(source, { a: false, b: true, c: true }), {
      b: 2,
      c: 3,
    });
  });

  it('includes a single key as a string', () => {
    const source = { a: 1, b: 2, c: 3, d: 4 };
    assert.deepEqual(onlyKeys(source, 'c'), { c: 3 });
  });

  it('ignores nonexistent properties', () => {
    const source = { a: 1, b: 2, c: 3, d: 4 };
    assert.deepEqual(onlyKeys(source, ['b', 'c', 'x']), { b: 2, c: 3 });
  });

  it('only includes own properties', () => {
    const source = Object.assign(Object.create({ p: 10000 }), {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    });

    assert.deepEqual(onlyKeys(source, ['b', 'c', 'p']), { b: 2, c: 3 });
  });
});
