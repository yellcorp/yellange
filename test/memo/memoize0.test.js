import sinon from 'sinon';
import { assert } from 'chai';

import { memoize0 } from '../../memo';

describe('memo#memoize0', () => {
  it('calls the inner function with no arguments', () => {
    const spy = sinon.spy();
    const memoed = memoize0(spy);

    memoed();

    assert(spy.calledOnce);
    assert(spy.calledWithExactly());
  });

  it('calls the inner function once at most', () => {
    const spy = sinon.spy();
    const memoed = memoize0(spy);

    memoed();
    memoed();

    assert(spy.calledOnce);
  });

  it('passes through the value of `this`', () => {
    const spy = sinon.spy();
    const obj = {
      method: memoize0(spy),
    };

    obj.method();

    assert(spy.calledOn(obj));
  });

  it('returns the result of the memoized function', () => {
    const aValue = { name: 'aValue' };
    const stub = sinon.stub().returns(aValue);
    const memoed = memoize0(stub);

    assert.strictEqual(memoed(), aValue);
    assert.strictEqual(memoed(), aValue);
  });
});
