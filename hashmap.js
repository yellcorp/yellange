/**
 * @file hashmap: Hash map with customizable key hashing and equality
 * functions.
 *
 * Note that this is *not* an implementation/polyfill of ES2015's global `Map`
 * class.
 */
import { extend } from './array';

const hasOwn = Object.prototype.hasOwnProperty;

function indexOfUsing(array, query, equalityFunc) {
  for (let i = 0; i < array.length; i++) {
    if (equalityFunc(array[i], query)) {
      return i;
    }
  }
  return -1;
}

function concatBuckets(buckets, pairIndex) {
  const result = [];
  for (const key in buckets) {
    if (hasOwn.call(buckets, key)) {
      const array = buckets[key][pairIndex];
      extend(result, array);
    }
  }
  return result;
}

function forEachWithoutThis(instance, func) {
  const buckets = instance._buckets;
  for (const hashedKey in buckets) {
    if (hasOwn.call(buckets, hashedKey)) {
      const [keys, values] = buckets[hashedKey];
      for (let i = 0; i < keys.length; i++) {
        func(values[i], keys[i], instance);
      }
    }
  }
}

function forEachWithThis(instance, func, thisArg) {
  const buckets = instance._buckets;
  for (const hashedKey in buckets) {
    if (hasOwn.call(buckets, hashedKey)) {
      const [keys, values] = buckets[hashedKey];
      for (let i = 0; i < keys.length; i++) {
        func.call(thisArg, values[i], keys[i], instance);
      }
    }
  }
}

export class HashMap {
  constructor(keyEqualityFunction = null, keyHashFunction = null) {
    this._keyEqual = keyEqualityFunction || Object.is;
    this._keyHash = keyHashFunction || String;
    this.clear();
  }

  clear() {
    this._buckets = {};
    this._length = 0;
  }

  get length() {
    return this._length;
  }

  delete(key) {
    const hashedKey = this._keyHash(key);
    const bucket = this._buckets[hashedKey];

    if (bucket) {
      const index = indexOfUsing(bucket[0], key, this._keyEqual);
      if (index >= 0) {
        bucket[0].splice(index, 1);
        bucket[1].splice(index, 1);
        this._length--;

        if (bucket[0].length === 0) {
          delete this._buckets[hashedKey];
        }
      }
    }
  }

  entries() {
    const entries = [];
    this.forEach((v, k) => {
      entries.push([k, v]);
    });
    return entries;
  }

  forEach(func, thisArg) {
    if (thisArg === undefined) {
      forEachWithoutThis(this, func);
    } else {
      forEachWithThis(this, func, thisArg);
    }
  }

  get(key, defaultValue = undefined) {
    const hashedKey = this._keyHash(key);
    const bucket = this._buckets[hashedKey];

    if (bucket) {
      const index = indexOfUsing(bucket[0], key, this._keyEqual);
      if (index >= 0) {
        return bucket[1][index];
      }
    }
    return defaultValue;
  }

  has(key) {
    const hashedKey = this._keyHash(key);
    const bucket = this._buckets[hashedKey];

    if (bucket) {
      const index = indexOfUsing(bucket[0], key, this._keyEqual);
      return index >= 0;
    }
    return false;
  }

  keys() {
    return concatBuckets(this._buckets, 0);
  }

  set(key, value) {
    const hashedKey = this._keyHash(key);
    let bucket = this._buckets[hashedKey];
    let index;

    if (bucket) {
      index = indexOfUsing(bucket[0], key, this._keyEqual);
    } else {
      this._buckets[hashedKey] = bucket = [[], []];
      index = -1;
    }

    if (index >= 0) {
      bucket[1][index] = value;
    } else {
      bucket[0].push(key);
      bucket[1].push(value);
      this._length++;
    }

    return value;
  }

  values() {
    return concatBuckets(this._buckets, 1);
  }

  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
