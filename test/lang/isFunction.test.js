import { assert } from 'chai';

import { isFunction } from '../../lang';

describe('lang#isFunction', () => {
  it('is true for functions', () => {
    function aFunction() {}
    assert.isTrue(isFunction(aFunction));

    const arrow = () => {};
    assert.isTrue(isFunction(arrow));
  });

  it('is true for methods', () => {
    assert.isTrue(isFunction([].slice));
    assert.isTrue(isFunction(''.substr));
    assert.isTrue(isFunction(Math.floor));
  });

  it('is false for regexes', () => {
    assert.isFalse(isFunction(isFunction(/A/)));
  });

  it('is false for null and undefined', () => {
    assert.isFalse(isFunction(null));
    assert.isFalse(isFunction(void 0));
  });

  it('is false for a sampling of other stuff', () => {
    assert.isFalse(isFunction('astring'));
    assert.isFalse(isFunction(0));
    assert.isFalse(isFunction(1));
    assert.isFalse(isFunction(new Date()));
    assert.isFalse(isFunction(true));
    assert.isFalse(isFunction(false));
    assert.isFalse(isFunction([]));
    assert.isFalse(isFunction(arguments));
  });
});
