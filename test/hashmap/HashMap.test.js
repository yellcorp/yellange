import sinon from 'sinon';
import { assert } from 'chai';

import { HashMap } from '../../hashmap';

function customKeyEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

describe('hashmap#HashMap', () => {
  describe('#constructor()', () => {
    it('accepts no arguments and creates a HashMap', () => {
      const h = new HashMap();
      assert.instanceOf(h, HashMap);
      assert.strictEqual(h.length, 0);
    });

    it('accepts 1 argument and creates a HashMap', () => {
      const h = new HashMap(Object.is);
      assert.instanceOf(h, HashMap);
      assert.strictEqual(h.length, 0);
    });

    it('accepts 2 arguments and creates a HashMap', () => {
      const h = new HashMap(Object.is, String);
      assert.instanceOf(h, HashMap);
      assert.strictEqual(h.length, 0);
    });
  });

  describe('#set()', () => {
    it('adds a key', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      h.set(a, 'A');
      assert.strictEqual(h.length, 1);
    });

    it('overwrites a key', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      h.set(a, 'A');
      h.set(a, '@');
      assert.strictEqual(h.length, 1);
    });

    it('adds another key', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const b = { name: 'b' };
      h.set(a, 'A');
      h.set(b, 'B');
      assert.strictEqual(h.length, 2);
    });

    it('uses the provided equality function', () => {
      const key1a = { x: 1, y: 1 };
      const key1b = { x: 1, y: 1 };
      const key2 = { x: 2, y: 1 };

      const value1 = { name: 'value1' };
      const value2 = { name: 'value2' };
      const value3 = { name: 'value3' };

      const h = new HashMap(customKeyEqual);

      h.set(key1a, value1);
      assert.strictEqual(h.length, 1);

      h.set(key2, value2);
      assert.strictEqual(h.length, 2);

      h.set(key1b, value3);
      assert.strictEqual(h.length, 2);
    });
  });

  describe('#get()', () => {
    it('gets a value', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const b = { name: 'b' };
      h.set(a, 'A');
      assert.strictEqual(h.get(a), 'A');
      h.set(a, '@');
      assert.strictEqual(h.get(a), '@');
      h.set(b, 'B');
      assert.strictEqual(h.get(b), 'B');
    });

    it('returns undefined by default for non-existent keys', () => {
      const h = new HashMap();
      const c = { name: 'c' };
      assert.isUndefined(h.get(c));
    });

    it('returns the provided default argument for non-existent keys', () => {
      const h = new HashMap();
      const c = { name: 'c' };
      const myDefault = { name: 'myDefault' };
      assert.strictEqual(h.get(c, myDefault), myDefault);
    });

    it('uses the provided equality function', () => {
      const key1a = { x: 1, y: 1 };
      const key1b = { x: 1, y: 1 };
      const key2 = { x: 2, y: 1 };
      const key3 = { x: 3, y: 1 };

      const value1 = { name: 'value1' };
      const value2 = { name: 'value2' };
      const value3 = { name: 'value3' };

      const h = new HashMap(customKeyEqual);

      h.set(key1a, value1);
      assert.strictEqual(h.get(key1a), value1);
      assert.strictEqual(h.get(key1b), value1);

      h.set(key2, value2);
      assert.strictEqual(h.get(key2), value2);

      h.set(key1b, value3);
      assert.strictEqual(h.get(key1b), value3);
      assert.strictEqual(h.get(key1a), value3);

      assert.isUndefined(h.get(key3));
    });
  });

  describe('#delete()', () => {
    it('deletes a value', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const b = { name: 'b' };
      const myDefault = { name: 'myDefault' };

      h.set(a, 'A');
      h.set(b, 'B');
      h.delete(a);
      assert.strictEqual(h.length, 1);
      assert.isUndefined(h.get(a));
      assert.strictEqual(h.get(a, myDefault), myDefault);
      assert.strictEqual(h.get(b), 'B');
    });

    it('accepts a non-existent key and makes no change', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const b = { name: 'b' };

      h.set(a, 'A');
      h.delete(b);
      assert.strictEqual(h.length, 1);
    });

    it('uses the provided equality function', () => {
      const key1a = { x: 1, y: 1 };
      const key1b = { x: 1, y: 1 };
      const key2 = { x: 2, y: 1 };

      const value1 = { name: 'value1' };
      const value2 = { name: 'value2' };

      const myDefault = { name: 'myDefault' };

      const h = new HashMap(customKeyEqual);

      h.set(key1a, value1);
      h.set(key2, value2);

      h.delete(key1b);
      assert.strictEqual(h.length, 1);
      assert.strictEqual(h.get(key1a, myDefault), myDefault);
      assert.strictEqual(h.get(key1b, myDefault), myDefault);
    });
  });

  describe('#clear()', () => {
    it('clears', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const myDefault = { name: 'myDefault' };
      h.set(a, 'A');
      h.clear();
      assert.strictEqual(h.length, 0);
      assert.strictEqual(h.get(a, myDefault), myDefault);
    });
  });

  describe('#entries()', () => {
    it('returns all entries', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const b = { name: 'b' };
      const c = { name: 'c' };

      h.set(a, 'A');
      h.set(b, 'B');
      h.set(a, '@');
      h.set(c, 'C');
      h.delete(c);

      const expectedEntries = [
        { key: a, value: '@' },
        { key: b, value: 'B' },
      ];

      const entries = h.entries();
      assert.strictEqual(entries.length, 2);

      const comparableEntries = entries.map(([key, value]) => ({ key, value }));
      assert.sameDeepMembers(comparableEntries, expectedEntries);
    });
  });

  describe('#forEach()', () => {
    it('calls the callback with the expected parameters (without this)', () => {
      const h = new HashMap();
      const aKey = { name: 'a' };
      const aValue = { value: 'A' };

      h.set(aKey, aValue);

      const spy = sinon.spy();
      h.forEach(spy);

      assert(spy.calledOnce);
      assert(spy.calledWithExactly(aValue, aKey, h));
    });

    it('calls the callback with the expected parameters (with this)', () => {
      const h = new HashMap();
      const aKey = { name: 'a' };
      const aValue = { value: 'A' };
      const intendedThis = { name: 'this' };

      h.set(aKey, aValue);

      const spy = sinon.spy();
      h.forEach(spy, intendedThis);

      assert(spy.calledOnce);
      assert(spy.calledWithExactly(aValue, aKey, h));
      assert(spy.calledOn(intendedThis));
    });

    it('iterates over all entries', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const b = { name: 'b' };
      const c = { name: 'c' };

      h.set(a, 'A');
      h.set(b, 'B');
      h.set(a, '@');
      h.set(c, 'C');
      h.delete(c);

      const spy = sinon.spy();
      h.forEach(spy);

      assert(spy.calledTwice);
      assert(spy.calledWithExactly('@', a, h));
      assert(spy.calledWithExactly('B', b, h));
    });
  });

  describe('#has()', () => {
    it('returns true for present keys', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const b = { name: 'b' };

      h.set(a, 'A');
      h.set(b, 'B');
      assert.isTrue(h.has(a));
      assert.isTrue(h.has(b));
    });

    it('returns false for absent keys', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const b = { name: 'b' };
      const c = { name: 'c' };

      h.set(a, 'A');
      h.set(b, 'B');

      assert.isFalse(h.has(c));
      h.delete(b);
      assert.isFalse(h.has(b));
    });

    it('uses the provided equality function', () => {
      const key1a = { x: 1, y: 1 };
      const key1b = { x: 1, y: 1 };
      const key2 = { x: 2, y: 1 };

      const value1 = { name: 'value1' };

      const h = new HashMap(customKeyEqual);

      h.set(key1a, value1);

      assert.isTrue(h.has(key1a));
      assert.isTrue(h.has(key1b));
      assert.isFalse(h.has(key2));
    });
  });

  describe('#keys()', () => {
    it('returns all keys', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const b = { name: 'b' };
      const c = { name: 'c' };

      h.set(a, 'A');
      h.set(b, 'B');
      h.set(a, '@');
      h.set(c, 'C');
      h.delete(c);

      assert.sameMembers(h.keys(), [a, b]);
    });
  });

  describe('#values()', () => {
    it('returns all values', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const b = { name: 'b' };
      const c = { name: 'c' };

      const valueA = { value: 'A' };
      const valueB = { value: 'B' };
      const valueAt = { value: '@' };
      const valueC = { value: 'C' };

      h.set(a, valueA);
      h.set(b, valueB);
      h.set(a, valueAt);
      h.set(c, valueC);
      h.delete(c);

      assert.sameMembers(h.values(), [valueAt, valueB]);
    });
  });

  describe('#[Symbol.iterator]()', () => {
    it('iterates over all entries', () => {
      const h = new HashMap();
      const a = { name: 'a' };
      const b = { name: 'b' };
      const c = { name: 'c' };

      h.set(a, 'A');
      h.set(b, 'B');
      h.set(a, '@');
      h.set(c, 'C');
      h.delete(c);

      const expectedEntries = [
        { key: a, value: '@' },
        { key: b, value: 'B' },
      ];

      const iteratedEntries = [];

      for (const [key, value] of h) {
        iteratedEntries.push({ key, value });
      }

      assert.sameDeepMembers(iteratedEntries, expectedEntries);
    });
  });
});
