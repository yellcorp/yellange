import { assert } from 'chai';

import { filter } from '../../dictionary';
import { testCommonCallback } from '../testlib/callback';

describe('dictionary#filter', () => {
  it('filters own properties of objects', () => {
    const source = Object.assign(Object.create({ PP: 12 }), {
      AA: 11,
      AB: 12,
      AC: 1,
      ad: 10,
      ae: 1,
    });

    const filterFunc = ([key, value]) => {
      return key === key.toUpperCase() && value >= 10;
    };
    const expect = { AA: 11, AB: 12 };

    assert.deepEqual(filter(source, filterFunc), expect);
  });

  testCommonCallback(it, filter);
});
