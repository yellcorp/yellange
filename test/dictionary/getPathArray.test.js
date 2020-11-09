import { assert } from 'chai';

import { getPathArray } from '../../dictionary';

describe('dictionary#getPathArray', () => {
  it('accesses nested properties in an object graph', () => {
    const source = {
      a: {
        b: {
          c: 99,
          d: 98,
        },
      },
    };

    assert.strictEqual(getPathArray(source, ['a', 'b', 'c']), 99);
    assert.strictEqual(getPathArray(source, ['a', 'b']), source.a.b);
    assert.strictEqual(getPathArray(source, ['a']), source.a);
  });

  it('returns the input object for an empty path', () => {
    const source = {
      a: {
        b: {
          c: 99,
          d: 98,
        },
      },
    };

    assert.strictEqual(getPathArray(source, []), source);
  });

  it('works with arrays', () => {
    const source = [
      {
        a: {
          children: [
            { lower: 'a', upper: 'A' },
            { lower: 'b', upper: 'B' },
            { lower: 'c', upper: 'C' },
          ],
        },
      },
    ];

    assert.strictEqual(
      getPathArray(source, [0, 'a', 'children', 1, 'upper']),
      'B'
    );
  });

  it('returns undefined by default for non-existent paths', () => {
    const source = {
      a: {
        b: {
          c: 99,
          d: 98,
        },
      },
    };

    assert.isUndefined(getPathArray(source, ['a', 'b', 'e']));
    assert.isUndefined(getPathArray(source, ['a', 'f']));
    assert.isUndefined(getPathArray(source, ['g']));
  });

  it('returns the supplied not-found value for non-existent paths', () => {
    const notFound = {};
    const source = {
      a: {
        b: {
          c: 99,
          d: 98,
        },
      },
    };

    assert.strictEqual(
      getPathArray(source, ['a', 'b', 'e'], notFound),
      notFound
    );

    assert.strictEqual(getPathArray(source, ['a', 'f'], notFound), notFound);
    assert.strictEqual(getPathArray(source, ['g'], notFound), notFound);
  });
});
