/**
 * A Mapping of String keys to arbitrary values that iterates in insertion
 * order.
 *
 * This is largely superceded by ES2015's global `Map` and its polyfills,
 * because that is also specified to remember insertion order. This may be an
 * option if your keys are limited to strings and you don't need/want to
 * polyfill a full arbitrary-key implementation.
 */
export class OrderedStringMap {
  constructor() {
    this.clear();
  }

  clear() {
    this._dict = {};
    this._keyToIndex = {};
    this._indexToKey = [];
    this._length = 0;
  }

  get length() {
    return this._length;
  }

  delete(key) {
    const skey = String(key);
    if (this.has(skey)) {
      let index = this._keyToIndex[skey];
      delete this._dict[skey];
      delete this._keyToIndex[skey];
      this._indexToKey.splice(index, 1);
      const length = (this._length = this._indexToKey.length);
      for (; index < length; index++) {
        this._keyToIndex[this._indexToKey[index]] = index;
      }
    }
    return true;
  }

  entries() {
    const entries = [];
    const len = this._length;
    for (let i = 0; i < len; i++) {
      const key = this._indexToKey[i];
      entries.push([key, this._dict[key]]);
    }
    return entries;
  }

  forEach(func, thisArg) {
    const len = this._length;
    let i, key;
    if (thisArg === undefined) {
      for (i = 0; i < len; i++) {
        key = this._indexToKey[i];
        func(this._dict[key], key, this);
      }
    } else {
      for (i = 0; i < len; i++) {
        key = this._indexToKey[i];
        func.call(thisArg, this._dict[key], key, this);
      }
    }
  }

  get(key) {
    return this._dict[String(key)];
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this._dict, String(key));
  }

  keys() {
    return this._indexToKey.slice();
  }

  set(key, value) {
    const skey = String(key);
    if (!this.has(skey)) {
      const index = this._indexToKey.length;
      this._indexToKey.push(skey);
      this._keyToIndex[skey] = index;
      this._length = index + 1;
    }
    this._dict[skey] = value;
  }

  values() {
    const values = [];
    const len = this._length;
    for (let i = 0; i < len; i++) {
      values.push(this._dict[this._indexToKey[i]]);
    }
    return values;
  }

  // end ES6-like methods
  keyAtIndex(index) {
    return this._indexToKey[index];
  }

  indexOfKey(key) {
    return this.has(key) ? this._keyToIndex[key] : -1;
  }

  valueAtIndex(index) {
    const key = this.keyAtIndex(index);
    return key === undefined ? key : this._dict[key];
  }

  toObject() {
    const object = {};
    const len = this._length;
    for (let i = 0; i < len; i++) {
      const key = this._indexToKey[i];
      object[key] = this._dict[key];
    }
    return object;
  }
}
