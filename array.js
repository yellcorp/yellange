/**
 * @file array: Array utilities
 */
import { genericCount } from './lib/internal/functional';

/**
 * A predicate function used by {@link array/count} to transform an
 * Object. Identical to the callback accepted by Array.prototype.filter.
 *
 * @callback ArrayPredicate
 * @param {*} element - The array element.
 * @param {number} index - The element's index in the array.
 * @param {*} array - The array that the element belongs to.
 * @return {boolean} - Whether to count this array member.
 */

/**
 * Returns the number of Array members that satisfy a test function.
 *
 * @param {*[]} array - The Array or array-like object to test.
 * @param {ArrayPredicate} predicate - The function that decides whether an
 *   array member is counted.
 * @param {*} [thisArg] - The value to use for `this` when calling the
 *   predicate function.
 */
export function count(array, predicate, thisArg = undefined) {
  return genericCount(array, predicate, array, thisArg);
}

/**
 * Extends an array in-place by appending the elements from one or more other
 * arrays.
 *
 * Stated another way, an in-place version of `Array.prototype.concat`, in that
 * the target array is modified.
 *
 * @param {Array} target - The Array to extend.
 * @param {...Array} extensions - The Arrays with elements to append to
 *   `target`.
 * @returns {Array} The target array.
 */
export function extend(target, ...extensions) {
  const count = extensions.length;
  for (let i = 0; i < count; i++) {
    const extension = extensions[i];
    if (!extension) {
      continue;
    }
    const len = extension.length;
    if (len === 0) {
      continue;
    } else if (len < 128) {
      target.push(...extension);
    } else {
      for (let j = 0; j < len; j++) {
        target.push(extension[j]);
      }
    }
  }
  return target;
}
