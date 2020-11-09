import { assert } from 'chai';

import { isArrayLike } from '../../lang';

describe('lang#isArrayLike', () => {
  it('is true for arrays', () => {
    assert.isTrue(isArrayLike([]));
  });

  it('is true for arguments', () => {
    assert.isTrue(isArrayLike(arguments));
  });

  it('is false for strings', () => {
    assert.isFalse(isArrayLike('no'));
  });

  it('is false for functions', () => {
    const aFunction = function () {};
    assert.isFalse(isArrayLike(aFunction));
  });

  it('is false for regexes', () => {
    assert.isFalse(isArrayLike(/A/));
  });

  it('is false for null and undefined', () => {
    assert.isFalse(isArrayLike(null));
    assert.isFalse(isArrayLike(void 0));
  });

  it('is true for HTMLCollection', () => {
    class HTMLCollection {
      constructor() {
        this.length = 0;
      }

      item(index) {
        return null;
      }

      namedItem(name) {
        return null;
      }
    }

    assert.isTrue(isArrayLike(new HTMLCollection()));
  });
});
