/**
 * @file sort: Sorting enhanced with key functions.
 */

import { isArrayLike, isFunction } from './lang';

function multiKeyExtractorFunction(keys) {
  const len = keys.length;
  return (obj) => {
    const values = [];
    for (let i = 0; i < len; i++) {
      values.push(obj[keys[i]]);
    }
    return values;
  };
}

function castKeyExtractor(thing) {
  // if nothing provided, return the identity function, making the object
  // itself the key
  if (thing == null) {
    return (obj) => obj;
  }

  // if it's a function then cool
  if (isFunction(thing)) {
    return thing;
  }

  // if it's array-like, assume the caller wants to sort on multiple properties
  if (isArrayLike(thing)) {
    const stringCopy = [];
    for (let i = 0; i < thing.length; i++) {
      stringCopy.push(String(thing));
    }
    return multiKeyExtractorFunction(stringCopy);
  }

  // if it's something else, return a function that uses it as a property
  // to access on the passed-in object
  return (obj) => obj[thing];
}

/**
 * Given a comparison function, returns a new function that reverses its
 * ordering.
 *
 * @param {ComparisonFunction} func - The function to reverse the ordering of.
 * @returns {ComparisonFunction} The new function.
 */
export function reverse(func) {
  return (a, b) => func(b, a);
}

/**
 * A comparison function that sorts simple orderable JavaScript values in
 * ascending order.
 *
 * @param {*} a - The first value.
 * @param {*} b - The second value.
 * @returns {number} The ordering between `a` and `b`.
 */
export function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * A comparison function that sorts simple orderable JavaScript values in
 * descending order.
 *
 * @param {*} a - The first value.
 * @param {*} b - The second value.
 * @returns {number} The ordering between `a` and `b`.
 */
export const descending = reverse(ascending);

/**
 * Lexical ordering comparison of two arrays.
 *
 * This function determines whether an Array is less than, greater than, or
 * equal to another, based on comparing the elements of each. Starting at index
 * 0, elements from each are compared until a non-equal pair is found. The
 * ordering of that pair is the result. If no non-equal pairs are found, then
 * the shorter Array is considered less than the longer one. If the Arrays are
 * the same length, they are considered equal.
 *
 * This comparison is analogous to how Strings are compared
 * character-by-character.
 *
 * Use this function as a keyComparator if you have a keyExtractor that returns
 * arrays.
 *
 * @param {*[]} a - The first Array of values.
 * @param {*[]} b - The second Array of values.
 * @returns {number} The ordering between `a` and `b`.
 */
export function compareArray(a, b) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const cmp = ascending(a[i], b[i]);
    if (cmp !== 0) {
      return cmp;
    }
  }
  return ascending(a.length, b.length);
}

/**
 * A comparison function that sorts Arrays of simple orderable JavaScript
 * values in ascending order. An alias of {@link sort/compareArray} named for
 * clarity when used with {@link sort/sortBy}.
 *
 * @param {*[]} a - The first Array of values.
 * @param {*[]} b - The second Array of values.
 * @returns {number} The ordering between `a` and `b`.
 */
export const ascendingArray = compareArray;

/**
 * A comparison function that sorts Arrays of simple orderable JavaScript
 * values in descending order.
 *
 * @param {*[]} a - The first Array of values.
 * @param {*[]} b - The second Array of values.
 * @returns {number} The ordering between `a` and `b`.
 */
export const descendingArray = reverse(compareArray);

/**
 * Returns a sorted shallow copy of an Array. Provides an enhancement over
 * Array.prototype.sort by accepting an optional key extraction function, which
 * can be used for many applications, such as sorting by one or multiple object
 * properties, sorting strings with embedded numbers naturally, etc.
 *
 * When sorting an array, the key extractor, if provided, is called with each
 * array member. The result acts as a sort key that stands in for the element.
 * If no key extractor is provided, each element acts as its own sort key.
 * These keys are then sorted using the comparison function to establish an
 * ordering. The original elements are then returned in the sorted order of
 * their corresponding keys.
 *
 * The key extractor function can also be a String or Array as a convenience
 * when working with an array of Objects. If it is a String, it is taken as the
 * name of a property to sort each Object by. If it is an Array, it is taken as
 * the names of multiple properties to sort by - if two Objects have the same
 * value for the first property, then the second named property of each is
 * compared, and so on.
 *
 * @param {*[]} array - The array to sort.
 * @param {KeyExtractorFunction|string|string[]} [keyExtractor] - A function
 *   that returns a sort key for each member, or the name of a property to sort
 *   on, or an array of properties to sort on. If not provided, then each array
 *   member acts as its own key.
 * @param {ComparisonFunction} [keyComparator] - An ordering function.
 * @returns {Array} A sorted copy of the input array.
 */
export function sortBy(array, keyExtractor = null, keyComparator = null) {
  const keyf = castKeyExtractor(keyExtractor);
  const keyedArray = [];

  // check if the user passed an array for keyExtractor - they'll want to sort
  // on multiple keys, which will need the array comparator functions. this
  // won't catch everything, but should be readable for common cases
  if (isArrayLike(keyExtractor)) {
    if (!keyComparator || keyComparator === ascending) {
      keyComparator = ascendingArray;
    } else if (keyComparator === descending) {
      keyComparator = descendingArray;
    }
  }

  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    keyedArray.push([element, keyf(element, i, array)]);
  }

  if (!keyComparator) {
    keyComparator = ascending;
  }
  keyedArray.sort((a, b) => keyComparator(a[1], b[1]));

  const sortedArray = [];
  for (let i = 0; i < keyedArray.length; i++) {
    sortedArray.push(keyedArray[i][0]);
  }

  return sortedArray;
}

/**
 * A function that returns sort keys for each element in an array to be sorted.
 *
 * @callback KeyExtractorFunction
 * @param {*} element - The array element.
 * @returns {*} A sort key for the element.
 */

/**
 * A function that establishes an ordering between two values.
 *
 * Its usage is the same as the function argument accepted by
 * Array.prototype.sort:
 *
 * - If `function(a, b)` is less than 0, `a` will be sorted before `b`.
 * - If `function(a, b)` is greater than 0, `a` will be sorted after `b`.
 * - If `function(a, b)` is 0, 'a' and `b` are considered equal.
 *
 * @callback ComparisonFunction
 * @param {*} a - The first value.
 * @param {*} b - The second value.
 * @returns {number} The ordering between `a` and `b`.
 */
