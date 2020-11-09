const CLEANUP_THRESHOLD = 16;
const NO_ARGS = [];

function removeNullish(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] == null) {
      array.splice(i, 1);
    }
  }
}

export class CallbackSet {
  constructor() {
    this._keys = [];
    this._values = [];
    this._removedCount = 0;
    this._length = 0;
  }

  get length() {
    return this._length;
  }

  clear() {
    // blank out the entire array, but maintain the same length. this is for
    // the same reason remove() nulls out members instead of deleting them -
    // it's so we can call this during an event dispatch without ruining the
    // loop in call()
    const len = this._keys.length;
    this._keys = new Array(len);
    this._values = new Array(len);

    // force a cleanup after the next call()
    this._removedCount = CLEANUP_THRESHOLD;

    this._length = 0;
  }

  contains(key) {
    return key != null && this._keys.indexOf(key) >= 0;
  }

  add(key, value) {
    if (!value) {
      value = key;
    }
    if (key != null && !this.contains(key)) {
      this._keys.push(key);
      this._values.push(value);
      this._length++;
    }
  }

  remove(key) {
    if (key != null) {
      const keys = this._keys;
      const index = keys.indexOf(key);
      if (index !== -1) {
        keys[index] = this._values[index] = null;
        this._length--;
      }
    }
  }

  call(...args) {
    this.apply(args);
  }

  apply(args = NO_ARGS) {
    if (this._length === 0) {
      return;
    }

    const values = this._values;
    for (let i = 0; i < values.length; i++) {
      const func = values[i];
      if (func != null) {
        func(...args);

        // check if we were disposed as a result of the function call. if so,
        // stop immediately.
        if (this._keys == null) {
          return;
        }
      } else {
        this._removedCount++;
      }
    }

    if (this._removedCount >= CLEANUP_THRESHOLD) {
      removeNullish(this._keys);
      removeNullish(values);
      this._removedCount = 0;
    }
  }

  dispose() {
    this._keys = this._values = null;
  }
}
