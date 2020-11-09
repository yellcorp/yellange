import { assert } from 'chai';

import { unzip, zip } from '../../dictionary';

describe('dictionary#unzip', () => {
  it('creates a key array and a value array from the own properties of an object', () => {
    const source = Object.assign(Object.create({ p: 'PP' }), {
      a: 'AA',
      b: 'BB',
      c: 'CC',
    });

    const kv = unzip(source);

    assert.isArray(kv);
    assert.strictEqual(kv.length, 2);
    assert.isArray(kv[0]);
    assert.strictEqual(kv[0].length, 3);
    assert.isArray(kv[1]);
    assert.strictEqual(kv[1].length, 3);

    const copy = zip(...kv);
    assert.deepEqual(copy, { a: 'AA', b: 'BB', c: 'CC' });
  });
});
