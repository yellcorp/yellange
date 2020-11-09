import sinon from 'sinon';
import { assert } from 'chai';

import { memoize } from '../../memo';

describe('memo#memoize', () => {
  it('calls the inner function with the provided arguments', () => {
    const spy = sinon.spy();
    const memoed = memoize(spy);

    memoed();
    assert(spy.calledOnce);
    assert(spy.calledWithExactly());

    memoed(2);
    assert(spy.calledTwice);
    assert(spy.calledWithExactly(2));

    memoed(3, 4);
    assert(spy.calledThrice);
    assert(spy.calledWithExactly(3, 4));
  });

  it('calls the inner function once per unique set of arguments at most', () => {
    const spy = sinon.spy();
    const memoed = memoize(spy);

    memoed();
    assert(spy.calledOnce);

    memoed();
    assert(spy.calledOnce);

    memoed(2);
    assert(spy.calledTwice);

    memoed(2);
    assert(spy.calledTwice);

    memoed(3, 4);
    assert(spy.calledThrice);

    memoed(3, 4);
    assert(spy.calledThrice);
  });

  it('calls the inner function once per unique set of arguments (including this) at most', () => {
    const spy = sinon.spy();
    const memoed = memoize(spy);

    const obj1 = { method: memoed };
    const obj2 = { method: memoed };

    obj1.method();
    assert(spy.calledOnce);

    obj1.method();
    assert(spy.calledOnce);

    obj2.method();
    assert(spy.calledTwice);

    obj2.method();
    assert(spy.calledTwice);

    obj1.method(3, 4);
    assert(spy.calledThrice);

    obj1.method(3, 4);
    assert(spy.calledThrice);

    obj2.method(3, 4);
    assert.strictEqual(spy.callCount, 4);

    obj2.method(3, 4);
    assert.strictEqual(spy.callCount, 4);
  });

  it('passes through the value of `this`', () => {
    const spy = sinon.spy();
    const obj = {
      method: memoize(spy),
    };

    obj.method(1);

    assert(spy.calledOn(obj));
  });

  it('returns the result of the memoized function', () => {
    function joiner(...args) {
      return args.join('|');
    }

    const memoed = memoize(joiner);

    assert.strictEqual(memoed(), '');
    assert.strictEqual(memoed(), '');
    assert.strictEqual(memoed(2), '2');
    assert.strictEqual(memoed(2), '2');
    assert.strictEqual(memoed(3, 4), '3|4');
    assert.strictEqual(memoed(3, 4), '3|4');
    assert.strictEqual(memoed(5, 6, 7), '5|6|7');
    assert.strictEqual(memoed(5, 6, 7), '5|6|7');
  });
});
