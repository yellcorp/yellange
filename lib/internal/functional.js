/**
 * @file lib/internal/functional
 *
 * Used by other modules to count elements of a structure by predicate.
 */
export function genericCount(array, predicate, parentObject, thisArg) {
  const length = array.length;
  let result = 0;

  if (thisArg === undefined) {
    for (let i = 0; i < length; i++) {
      if (predicate(array[i], i, parentObject)) {
        result++;
      }
    }
  } else {
    for (let i = 0; i < length; i++) {
      if (predicate.call(thisArg, array[i], i, parentObject)) {
        result++;
      }
    }
  }

  return result;
}
