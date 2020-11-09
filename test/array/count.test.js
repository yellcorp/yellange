import { assert } from 'chai';
import sinon from 'sinon';

import { count } from '../../array';

describe('array#count()', () => {
  it('works in the simple case', () => {
    const testArray = [1, 2, 11, 12, 13];

    assert.strictEqual(
      count(testArray, (n) => n > 10),
      3
    );

    assert.strictEqual(
      count(testArray, (n) => n < 10),
      2
    );
  });

  it('sets `this` value correctly', () => {
    const object = {
      myValue: 3,
      test(element) {
        return element === this.myValue;
      },
    };

    const unboundTest = object.test;
    // test that object.test is indeed unbound
    assert.throws(() => unboundTest(1));

    const testArray = [1, 2, 3, 3, 3, 3, 4];
    assert.strictEqual(count(testArray, object.test, object), 4);
  });

  it('calls the predicate function correctly', () => {
    const spy = sinon.spy();
    const testArray = ['A'];

    count(testArray, spy);

    assert(spy.calledOnce);
    assert(spy.calledWithExactly('A', 0, testArray));

    const anObject = {};
    const spy2 = sinon.spy();

    count(testArray, spy2, anObject);

    assert(spy2.calledOn(anObject));
    assert(spy2.calledOnce);
    assert(spy2.calledWithExactly('A', 0, testArray));
  });
});
