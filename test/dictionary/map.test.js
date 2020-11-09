import { assert } from 'chai';

import { map } from '../../dictionary';
import { testCommonCallback } from '../testlib/callback';

describe('dictionary#map', () => {
  it('transforms own properties of objects', () => {
    const source = Object.assign(Object.create({ p: 1000 }), {
      a: 1,
      b: 2,
      c: 3,
    });

    const mapFunc = ([key, value]) => [key.toUpperCase(), value * 10];

    const expect = { A: 10, B: 20, C: 30 };

    assert.deepEqual(map(source, mapFunc), expect);
  });

  testCommonCallback(it, map);
});
