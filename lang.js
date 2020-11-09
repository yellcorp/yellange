/**
 * @file lang: JavaScript language utilities
 *
 * Method binding, safe `hasOwn`, type checking, all the usual.
 */

const objToString = Object.prototype.toString;
const objHasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Returns whether the argument is Array-like. It is considered Array-like if
 * it is not null or undefined, is not a Function or String, and has a `length`
 * property that is an integer greater than or equal to zero.
 *
 * @param {*} thing - The value to examine.
 * @returns {boolean} `true` if `thing` is Array-like, otherwise `false`.
 */
export function isArrayLike(thing) {
  if (thing == null) {
    return false;
  }

  switch (typeof thing) {
    case 'function':
    case 'string':
      return false;
  }

  return Number.isInteger(thing.length) && thing.length >= 0;
}

// /^_?on[A-Z]/
function bindMethodsByRegExp(instance, regex) {
  // we have to manually walk the prototype chain because ES6 classes (at least
  // using babelify) set methods as non-enumerable. the only way we can get
  // non-enumerable properties is through getOwnPropertyNames.

  // and seeing as we don't want instance's *own* properties we start with its
  // prototype.
  let obj = Object.getPrototypeOf(instance);

  while (obj && obj !== Object.prototype) {
    const names = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const value = instance[name];

      if (
        !objHasOwnProperty.call(instance, name) &&
        typeof value === 'function' &&
        regex.test(name)
      ) {
        instance[name] = value.bind(instance);
      }
    }
    obj = Object.getPrototypeOf(obj);
  }
}

function bindMethodsByNames(instance, names) {
  for (const name of names) {
    if (
      !objHasOwnProperty.call(instance, name) &&
      typeof instance[name] === 'function'
    ) {
      instance[name] = instance[name].bind(instance);
    }
  }
}

/**
 * Binds one or more methods of an object.
 *
 * A bound method, in relation to an object, is one that will always have
 * `this` set to that object.
 *
 * Methods can be specified as follows:
 * - As an array of strings, each being the name of a method to bind,
 * - As a string, which names a single method to bind,
 * - As a RegExp, which will bind all methods with matching names.
 *
 * A property will be ignored if it doesn't represent a method, (i.e. its type
 * isn't "function"), or if it is already an own property of the object.
 *
 * When a RegExp is used, it is tested against both enumerable and
 * non-enumerable properties in the prototype chain.
 *
 * @param {Object} instance - The Object with methods to bind.
 * @param {string[]|string|RegExp} methodSpec - The methods to bind.
 */
export function bindMethods(instance, methodSpec) {
  if (methodSpec && typeof methodSpec.test === 'function') {
    bindMethodsByRegExp(instance, methodSpec);
  } else if (!isArrayLike(methodSpec)) {
    bindMethodsByNames(instance, [methodSpec]);
  } else {
    bindMethodsByNames(instance, methodSpec);
  }
}

/**
 * Returns whether an Object has an own property by the given name.
 *
 * This acts as a reliable way of calling Object.prototype.hasOwnProperty, even
 * if it has been overwitten by an own property or somewhere in the protoype
 * chain.
 *
 * @param {*} object - The object to test.
 * @param {string} property - The property name to test.
 * @returns {boolean} `true` if `property` is an own property of `object`,
 * otherwise `false`.
 */
export const hasOwn = objHasOwnProperty.call.bind(objHasOwnProperty);

function typeStringTester(idString) {
  const fullString = `[object ${idString}]`;
  return function (thing) {
    return objToString.call(thing) === fullString;
  };
}

/**
 * Returns whether the argument is a Function.
 *
 * @param {*} thing - The value to examine.
 * @returns {boolean} `true` if `thing` is a Function, otherwise `false`.
 */
export const isFunction = typeStringTester('Function');
