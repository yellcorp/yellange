import { assert } from 'chai';

import { hasOwn } from '../../lang';

describe('lang#hasOwn', () => {
  it('returns true for own properties and false otherwise', () => {
    const subject = Object.create({ p: 10 });
    subject.a = 20;

    assert.isTrue(hasOwn(subject, 'a'));
    assert.isFalse(hasOwn(subject, 'p'));
    assert.isFalse(hasOwn(subject, 'x'));
  });

  it('works for objects that redefine hasOwnProperty', () => {
    const ruiner = {
      p: 10,
      hasOwnProperty: function (_) {
        return NaN;
      },
    };

    assert.isTrue(hasOwn(ruiner, 'p'));
    assert.isFalse(hasOwn(ruiner, 'x'));
    assert.isTrue(hasOwn(ruiner, 'hasOwnProperty'));

    const subject = Object.create(ruiner);
    subject.a = 20;

    assert.isTrue(hasOwn(subject, 'a'));
    assert.isFalse(hasOwn(subject, 'p'));
    assert.isFalse(hasOwn(subject, 'x'));
    assert.isFalse(hasOwn(subject, 'hasOwnProperty'));
  });
});
