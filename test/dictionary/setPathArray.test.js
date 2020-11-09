import { assert } from 'chai';

import { setPathArray } from '../../dictionary';

describe('dictionary#setPathArray', () => {
  it('rejects null or undefined root objects', () => {
    assert.throws(() => {
      setPathArray(null, ['a'], 'A');
    }, TypeError);

    assert.throws(() => {
      setPathArray(undefined, ['a'], 'A');
    }, TypeError);
  });

  it('rejects empty paths', () => {
    assert.throws(() => {
      setPathArray({}, [], 'A');
    }, TypeError);
  });

  it('sets nested properties by navigating existing nodes in an object graph', () => {
    const source = { A: { B: 'b' } };
    const originalA = source.A;
    setPathArray(source, ['A', 'B'], 'different_b');
    assert.strictEqual(source.A, originalA);
    assert.strictEqual(source.A.B, 'different_b');
  });

  it('sets nested properties by adding them to leaf nodes', () => {
    const source = { A: { B: 'b' } };
    const originalA = source.A;
    setPathArray(source, ['A', 'C'], 'c');
    const expectLeaf = { B: 'b', C: 'c' };
    assert.strictEqual(source.A, originalA);
    assert.strictEqual(source.A.C, 'c');
    assert.deepEqual(source.A, expectLeaf);
  });

  it('sets nested properties by creating intermediate nodes', () => {
    const source = {
      A: {
        B: { leaf1: 'value1' },
      },
    };

    const expect = {
      A: {
        B: { leaf1: 'value1' },
        C: {
          D: { leaf2: 'value2' },
        },
      },
    };

    const originalA = source.A;
    setPathArray(source, ['A', 'C', 'D', 'leaf2'], 'value2');
    assert.strictEqual(source.A, originalA);
    assert.deepEqual(source, expect);
    assert.strictEqual(Object.getPrototypeOf(source.A.C), Object.prototype);
  });

  it('sets nested properties by creating intermediate nodes using the provided creation function', () => {
    const somePrototype = { P: 'p' };
    const testCreator = () => Object.create(somePrototype);

    const source = {
      A: {
        B: { leaf1: 'value1' },
      },
    };

    const expect = {
      A: {
        B: { leaf1: 'value1' },
      },
    };
    expect.A.C = testCreator();
    expect.A.C.D = testCreator();
    expect.A.C.D.leaf2 = 'value2';

    setPathArray(source, ['A', 'C', 'D', 'leaf2'], 'value2', testCreator);
    assert.deepEqual(source, expect);
    assert.strictEqual(Object.getPrototypeOf(source.A.C), somePrototype);
    assert.strictEqual(Object.getPrototypeOf(source.A.C.D), somePrototype);
  });
});
