import { assert } from 'chai';

import { getPath } from '../../dictionary';

describe('dictionary#getPath', () => {
  it('accesses nested properties in an object graph', () => {
    const source = {
      a: {
        b: {
          c: 99,
          d: 98,
        },
      },
    };

    assert.strictEqual(getPath(source, 'a.b.c'), 99);
    assert.strictEqual(getPath(source, 'a.b'), source.a.b);
    assert.strictEqual(getPath(source, 'a'), source.a);
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

    assert.strictEqual(getPath(source, ''), source);
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

    assert.strictEqual(getPath(source, ['0.a.children.1.upper']), 'B');
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

    assert.isUndefined(getPath(source, ['a.b.e']));
    assert.isUndefined(getPath(source, ['a.f']));
    assert.isUndefined(getPath(source, ['g']));
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

    assert.strictEqual(getPath(source, ['a.b.e'], notFound), notFound);
    assert.strictEqual(getPath(source, ['a.f'], notFound), notFound);
    assert.strictEqual(getPath(source, ['g'], notFound), notFound);
  });
});
