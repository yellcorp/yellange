import { assert } from 'chai';

import { count } from '../../dictionary';
import { testCommonCallback } from '../testlib/callback';

describe('dictionary#count', () => {
  it('counts own key/value pairs', () => {
    const source = Object.assign(Object.create({ PP: 12 }), {
      AA: 11,
      AB: 12,
      AC: 1,
      ad: 10,
      ae: 1,
    });

    const countFunc = ([key, value]) => {
      return key === key.toUpperCase() && value >= 10;
    };

    assert.strictEqual(count(source, countFunc), 2);
  });

  testCommonCallback(it, count);
});
