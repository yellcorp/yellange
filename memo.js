/**
 * @file memo: Function memoization
 */
import { HashMap } from './hashmap';

const SENTINEL = {};

function shallowElementIdentity(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  const len = a.length;
  for (let i = 0; i < len; i++) {
    if (!Object.is(a[i], b[i])) {
      return false;
    }
  }
  return true;
}

function thisAndArgsEquality(a, b) {
  return Object.is(a[0], b[0]) && shallowElementIdentity(a[1], b[1]);
}

/*
 * Memoize a function. This is the most generic form, and can handle functions
 * that take any number of mandatory or optional arguments. For methods, the
 * value for `this` is also recorded. Arguments and this-values are matched by
 * comparing them to prior invocations using Object.is.
 *
 * There are optimized versions of this function for certain use cases:
 * `memoize0` is simpler and faster for memoizing zero-argument functions.
 * `memoize1` is for single-argument functions if the argument has a unique
 * string representation for each unique possible value, such as Strings and
 * Numbers.
 */
export function memoize(func) {
  const memo = new HashMap(thisAndArgsEquality);

  /* eslint-disable no-invalid-this */
  return function (...args) {
    // avoid the repeated lookup implied in .has followed by .get. but also
    // pass a unique private value so we don't have to rely on 'undefined' -
    // that would be ambiguous if the memoized function can return undefined
    const key = [this, args];
    const ret = memo.get(key, SENTINEL);
    if (ret === SENTINEL) {
      return memo.set(key, func.apply(this, args));
    }
    return ret;
  };
  /* eslint-enable no-invalid-this */
}

/*
 * Memoize a zero-parameter function. The return value is stored after the
 * target function is run once. All subsequent calls return the stored value
 * unconditionally.
 */
export function memoize0(func) {
  let called = false;
  let cachedValue;

  return function () {
    if (called) {
      return cachedValue;
    }
    called = true;
    // eslint-disable-next-line no-invalid-this
    return (cachedValue = func.call(this));
  };
}

/*
 * Memoize a single-parameter function. Requires that the single parameter has
 * a unique string representation for each unique value. Passes through `this`,
 * but caching is not affected by its value.
 */
export function memoize1(func) {
  const has = {};
  const memo = {};

  return function (arg) {
    if (has[arg] === SENTINEL) {
      return memo[arg];
    }
    has[arg] = SENTINEL;
    // eslint-disable-next-line no-invalid-this
    return (memo[arg] = func.call(this, arg));
  };
}
