import sinon from 'sinon';
import { assert } from 'chai';

import { memoize1 } from '../../memo';

describe('memo#memoize1', () => {
  it('calls the inner function with the provided argument', () => {
    const spy = sinon.spy();
    const memoed = memoize1(spy);

    memoed(1);
    assert(spy.calledOnce);
    assert(spy.calledWithExactly(1));

    memoed(2);
    assert(spy.calledTwice);
    assert(spy.calledWithExactly(2));
  });

  it('calls the inner function once per unique argument at most', () => {
    const spy = sinon.spy();
    const memoed = memoize1(spy);

    memoed(1);
    assert(spy.calledOnce);

    memoed(1);
    assert(spy.calledOnce);

    memoed(2);
    assert(spy.calledTwice);

    memoed(2);
    assert(spy.calledTwice);
  });

  it('passes through the value of `this`', () => {
    const spy = sinon.spy();
    const obj = {
      method: memoize1(spy),
    };

    obj.method(1);

    assert(spy.calledOn(obj));
  });

  it('returns the result of the memoized function', () => {
    const aValue = { name: 'aValue' };
    const bValue = { name: 'bValue' };

    const stub = sinon.stub();
    stub.withArgs(1).returns(aValue);
    stub.withArgs(2).returns(bValue);

    const memoed = memoize1(stub);

    assert.strictEqual(memoed(1), aValue);
    assert.strictEqual(memoed(2), bValue);
  });
});
