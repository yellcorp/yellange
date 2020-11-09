/**
 * @file bimap: Bijective String Map
 *
 * AKA two-way map, bidirectional map, etc. Implemented with a pair of plain JS
 * Objects, so values have the same restriction as keys - they can only be
 * Strings.
 */
import { isArrayLike } from './lang';

const hasOwn = Object.prototype.hasOwnProperty;

function del(instance, fwdKey, revKey) {
  delete instance._fwd[fwdKey];
  delete instance._rev[revKey];
}

export class BijectiveStringMap {
  constructor(initialMap) {
    this.clear();
    if (initialMap) {
      this.setKeyValueMap(initialMap);
    }
  }

  clear() {
    this._fwd = {};
    this._rev = {};
  }

  hasKey(key) {
    return hasOwn.call(this._fwd, key);
  }

  hasValue(value) {
    return hasOwn.call(this._rev, value);
  }

  getValue(key) {
    return this._fwd[key];
  }

  getKey(value) {
    return this._rev[value];
  }

  set(key, value) {
    const skey = String(key);
    const svalue = String(value);
    this.deleteKey(skey);
    this._fwd[skey] = svalue;
    this._rev[svalue] = skey;
  }

  deleteKey(key) {
    if (this.hasKey(key)) {
      del(this, key, this._fwd[key]);
    }
  }

  deleteValue(value) {
    if (this.hasValue(value)) {
      del(this, this._rev[value], value);
    }
  }

  forEach(func, thisArg) {
    const pairs = this.pairs();
    for (let i = 0; i < pairs.length; i++) {
      func.call(thisArg, pairs[i], this);
    }
  }

  keys() {
    return Object.keys(this._fwd);
  }

  values() {
    // it's done this way so calls to keys, followed by calls to
    // values, with no modification in between, will iterate in
    // the same (arbitrary, js-engine-dependent) order
    const fwd = this._fwd;
    const keys = this.keys();
    const values = [];
    for (let i = 0; i < keys.length; i++) {
      values.push(fwd[keys[i]]);
    }
    return values;
  }

  entries() {
    const fwd = this._fwd;
    const keys = this.keys();
    const pairs = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      pairs.push([key, fwd[key]]);
    }
    return pairs;
  }

  getKeyValueMap() {
    return Object.assign({}, this._fwd);
  }

  setKeyValueMap(newFwd) {
    if (isArrayLike(newFwd)) {
      for (let i = 0; i < newFwd.length; i++) {
        this.set(i, newFwd[i]);
      }
    } else {
      for (const k in newFwd) {
        if (hasOwn.call(newFwd, k)) {
          this.set(k, newFwd[k]);
        }
      }
    }
  }

  getValueKeyMap() {
    return Object.assign({}, this._rev);
  }

  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
