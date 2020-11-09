/**
 * @file dictionary: Utilities for POJSOs used as dictionaries/mappings.
 *
 * Includes higher-order functions, zip/unzip, and key traversal.
 */

import { genericCount } from './lib/internal/functional';
import { isArrayLike } from './lang';

function toKeySet(something, presentValue) {
  if (!something) {
    return {};
  }

  switch (typeof something) {
    case 'string':
    case 'number':
      return { [something]: presentValue };
  }

  const presence = {};
  if (isArrayLike(something)) {
    for (let i = 0; i < something.length; i++) {
      presence[something[i]] = presentValue;
    }
  } else {
    const keys = Object.keys(something);
    for (let i = 0; i < keys.length; i++) {
      if (something[keys[i]]) {
        presence[keys[i]] = presentValue;
      }
    }
  }
  return presence;
}

/**
 * Returns the number of key-value pairs in an Object that satisfy a test
 * function.
 *
 * @param {*} object - The object to test.
 * @param {KeyValuePredicate} predicate - The function that decides whether an
 *   key-value pair is counted.
 * @param {*} [thisArg] - The value to use for `this` when calling the
 *   predicate function.
 */
export function count(object, predicate, thisArg) {
  return genericCount(toEntries(object), predicate, object, thisArg);
}

/**
 * The filter operation for Objects. Creates a new Object containing all the
 * input Object's own key-value pairs for which the provided filter function
 * returns true.
 *
 * @param {*} object - The input Object.
 * @param {KeyValuePredicate} predicate - The function that decides whether a
 *   key-value pair is included in the result object.
 * @param {*} [thisArg] - The value to use for `this` when calling `func`.
 */
export function filter(object, predicate, thisArg) {
  return fromEntries(
    toEntries(object).filter((p, i) => predicate.call(thisArg, p, i, object))
  );
}

/**
 * A predicate function used by {@link dictionary/filter} and {@link
 * dictionary/count}. It is analogous to the callback accepted by
 * Array.prototype.filter.
 *
 * @callback KeyValuePredicate
 * @param {*[]} pair - The key-value pair.
 * @param {string} pair[0] - The key.
 * @param {*} pair[1] - The value.
 * @param {number} index - The index. Note that the association of an index
 *   with a given key-value pair is arbitrary, implementation-dependent, ands
 *   can vary between calls.
 * @param {*} object - The Object that the key-value pair belongs to.
 * @return {boolean} - Whether to include this key-value pair in a total count,
 * or in a resultant Object. A truthy value includes, falsy omits.
 */

/**
 * Creates a plain Object from an Array of [ key, value ] pairs.
 *
 * @param {Array[]} entries - The key-value pairs to comprise the new Object.
 * @param {string} entries[][0] - The key.
 * @param {*} entries[][1] - The value to store against the key.
 * @returns {Object} The resultant object.
 */
export function fromEntries(entries) {
  const result = {};
  for (let i = 0; i < entries.length; i++) {
    result[entries[i][0]] = entries[i][1];
  }
  return result;
}

/**
 * Retrieves a value from a tree structure by key path, with the key path
 * expressed as a dot-separated string.
 *
 * This is like {@link dictionary/getPathArray}, except it accepts the key path
 * as a string, where each property is separated by a single period/full stop
 * ("."), analogous to JavaScript syntax.
 *
 * @param {*} object - The root object.
 * @param {string|Array<string>} path - The key path to look up.
 * @param {*} [valueIfNotFound] - The value to return if the key path does not
 *   exist.
 * @returns {*} Either the resultant value, or `valueIfNotFound`.
 */
export function getPath(object, path, valueIfNotFound) {
  return getPathArray(object, stringPathToArray(path), valueIfNotFound);
}

/**
 * Retrieves a value from a tree structure by key path, with the key path
 * expressed as an Array of strings.
 *
 * Starting at the passed object, considered the root, the first element of
 * `pathArray` is looked up to retrieve the next object. The following
 * `pathArray` element is looked up on that object, and so on. This process is
 * repeated until all keys in `pathArray` have been traversed, at which point
 * the result value is returned, or a lookup results in null or undefined, in
 * which case, by default, `undefined` is returned.
 *
 * @param {*} object - The root object.
 * @param {string[]} pathArray - The key path to look up.
 * @param {*} [valueIfNotFound] - The value to return if the key path does not
 *   exist.
 * @returns {*} Either the resultant value, or `valueIfNotFound`.
 */
export function getPathArray(object, pathArray, valueIfNotFound = undefined) {
  if (pathArray.length === 0) {
    return object;
  }
  const lastIndex = pathArray.length - 1;
  const lastKey = pathArray[lastIndex];
  for (let i = 0; i < lastIndex; i++) {
    if (object == null) {
      return valueIfNotFound;
    }
    object = object[pathArray[i]];
  }
  if (object != null && lastKey in object) {
    return object[lastKey];
  }
  return valueIfNotFound;
}

/**
 * Creates a new Object by transforming every key-value pair of an input Object
 * through a provided function.
 *
 * This is analogous to `Array.prototype.map`. Each enumerable own property is
 * passed to the provided function as a 2-member array `[ key, value ]`, where
 * index 0 contains the property name, and index 1 contains the value stored
 * against it. The function's return value must also be a 2-member array, which
 * is interpreted the same way and assigned to a new Object.
 *
 * The provided function can return a new 2-member Array, or modify the one
 * passed in and return that.
 *
 * @param {*} object - The input Object.
 * @param {KeyValueMapper} func - The function to apply.
 * @param {*} [thisArg] - The value to use for `this` when calling `func`.
 */
export function map(object, func, thisArg) {
  return fromEntries(
    toEntries(object).map((p, i) => func.call(thisArg, p, i, object))
  );
}

/**
 * A mapping function used by {@link dictionary/map} to transform an Object. It
 * is analogous to the callback accepted by Array.prototype.map.
 *
 * @callback KeyValueMapper
 * @param {*[]} pair - The key-value pair.
 * @param {string} pair[0] - The key.
 * @param {*} pair[1] - The value.
 * @param {number} index - The index. Note that the association of an index
 *   with a given key-value pair is arbitrary, implementation-dependent, and
 *   can vary between calls.
 * @param {*} object - The Object that the map or filter operation is being
 *   applied to.
 * @return {*[]} - A key-value pair to set in the resultant Object.
 */

const PRESENT = {};

/**
 * Returns a copy of an Object with only the nominated keys included. If a
 * nominated key is not an own property of the input Object, it is not inlcuded
 * in the result either.
 *
 * @param {*} object - The input Object.
 * @param {*} keys - The keys to include, as an Array of Strings or Numbers, as
 *   an Object mapping key names to truthy values (falsy values will not be
 *   included), or a String or Number specifying a single key to include.
 * @returns {Object} The filtered object.
 */
export function onlyKeys(object, keys) {
  const keySet = toKeySet(keys, PRESENT);
  const oKeys = Object.keys(object);
  const result = {};

  for (let i = 0; i < oKeys.length; i++) {
    if (keySet[oKeys[i]] === PRESENT) {
      result[oKeys[i]] = object[oKeys[i]];
    }
  }

  return result;
}

/**
 * Sets a value in a tree structure by key path, with the key path expressed as
 * an dot-separated string.
 *
 * This is like {@link dictionary/setPathArray}, except it accepts the key path
 * as a string, where each property is separated by a single period/full stop
 * ("."), analogous to JavaScript syntax.
 *
 * @param {*} object - The root object.
 * @param {string} path - The key path to set.
 * @param {*} value - The value to set.
 * @param {NodeFactory} [nodeCreationFunction] - A function that creates
 *   objects, called when an intermediate object does not exist.
 * @returns {*} The value.
 */
export function setPath(object, path, value, nodeCreationFunction = null) {
  setPathArray(object, stringPathToArray(path), value, nodeCreationFunction);
}
function createPlainObject() {
  return {};
}

/**
 * Sets a value in a tree structure by key path, with the key path expressed as
 * an Array of strings. If at any point, an intermediate object does not exist,
 * it is created. The function that creates intermediate objects can be
 * customized; it defaults to a function that just returns empty plain Objects.
 *
 * @param {*} object - The root object.
 * @param {string[]} pathArray - The key path to set.
 * @param {*} value - The value to set.
 * @param {NodeFactory} [nodeCreationFunction] - A function that creates
 *   objects, called when an intermediate object does not exist.
 * @returns {*} The value.
 */
export function setPathArray(
  object,
  pathArray,
  value,
  nodeCreationFunction = null
) {
  if (object == null) {
    throw new TypeError('Null or undefined root object');
  }

  if (pathArray.length === 0) {
    throw new TypeError('Zero-length path');
  }

  if (!nodeCreationFunction) {
    nodeCreationFunction = createPlainObject;
  }

  const lastIndex = pathArray.length - 1;
  const lastKey = pathArray[lastIndex];

  let nextObject;
  for (let i = 0; i < lastIndex; i++) {
    const property = pathArray[i];
    nextObject = object[property];
    if (nextObject == null) {
      nextObject = object[property] = nodeCreationFunction();
    }
    object = nextObject;
  }

  object[lastKey] = value;
}

/**
 * A function that customizes node creation by the {@link
 * dictionary/setPathArray} and {@link dictionary/setPath} functions. It is
 * called with no parameters.
 *
 * @callback NodeFactory
 * @return {*} - A new node.
 */
export function stringPathToArray(path) {
  const pathString = String(path);
  return pathString ? pathString.split('.') : [];
}
/**
 * Returns an Array of [ key, value ] pairs for each own property of an object.
 *
 * @param {*} object - The Object to enumerate.
 * @returns {Array[]} An array of 2-member arrays. In each sub-array, index 0
 *   is an own property key, and index 1 contains its value.
 */
export function toEntries(object) {
  const entries = [];
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    entries.push([keys[i], object[keys[i]]]);
  }
  return entries;
}
/**
 * Returns a 2-member Array in which index 0 contains an Array of all the
 * object's own keys, and index 1 contains their corresponding values.
 *
 * @param {*} object - The Object to enumerate.
 * @returns {Array[]} A 2-member Array. Index 0 contains an Array of keys,
 *   index 1 contains their values.
 */
export function unzip(object) {
  const keys = Object.keys(object);
  const values = [];
  for (let i = 0; i < keys.length; i++) {
    values.push(object[keys[i]]);
  }
  return [keys, values];
}

/**
 * Returns a copy of an Object with the nominated keys excluded.
 *
 * @param {*} object - The input Object.
 * @param {*} keys - The keys to exclude, as an Array of Strings or Numbers, as
 *   an Object mapping key names to truthy values (falsy values will not be
 *   excluded), or a String or Number specifying a single key to exclude.
 * @returns {Object} The filtered object.
 */
export function withoutKeys(object, keys) {
  const keySet = toKeySet(keys, PRESENT);
  const oKeys = Object.keys(object);
  const result = {};

  for (let i = 0; i < oKeys.length; i++) {
    if (keySet[oKeys[i]] !== PRESENT) {
      result[oKeys[i]] = object[oKeys[i]];
    }
  }

  return result;
}
/**
 * Creates a plain Object out of an array of keys and an array of values.  The
 * resultant Object will have keys[n] set to values[n] for all n.
 *
 * @param {string[]} keys - The keys.
 * @param {*[]} values - The values.
 * @returns {Object} The resultant object.
 */
export function zip(keys, values) {
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = values[i];
  }
  return result;
}
