import sinon from 'sinon';
import { assert } from 'chai';

export function testCommonCallback(it, functionToTest) {
  it('calls the callback function correctly', () => {
    const spy = sinon.spy(() => ['a', 1]);
    const testObject = { b: 2 };

    functionToTest(testObject, spy);
    const noThisCall = spy.getCall(0);
    assert.notExists(noThisCall.thisValue);
    assert.deepEqual(noThisCall.args, [['b', 2], 0, testObject]);

    const testThis = {};
    functionToTest(testObject, spy, testThis);
    const thisCall = spy.getCall(1);
    assert.strictEqual(thisCall.thisValue, testThis);
    assert.deepEqual(thisCall.args, [['b', 2], 0, testObject]);
  });
}
