/**
 * transformBuilder is a utility for building CSS transform strings in a more
 * robust and readable manner than string concatenation. Its interface is
 * designed so that calling code resembles the appearance of equivalent CSS
 * transform strings.
 *
 * Example:
 *
 *```
 * > transformBuilder
 * ... .translateY("1em")
 * ... .rotateZ(1)
 * ... .toString();
 *
 * "translateY(1em) rotateZ(1rad)"
 *```
 *
 * Functions are named after the CSS transform they generate.  They have
 * default units (except for `matrix` and `matrix3d`), which are used if
 * numeric arguments are provided.  The default units are `px` for lengths and
 * `rad` for angles.  String arguments are used verbatim.
 *
 * Functions are designed to be chained, which has the effect of appending a
 * transform.  Calling `toString()` at the end returns all transforms in a
 * space-separated string.
 */

// implementation note:
//
// The methods on Builder and the exported functions are generated dynamically.
// Builder methods return the instance it was called on for chaining.
// Module-level functions are very similar, but first construct a Builder
// instance, then pass the arguments to the same-named method on it, and return
// the Builder.

// The function/method names are ultimately taken from the keys of the
// FUNC_SPECS object.

const DEFAULT_UNITS = {
  length: 'px',
  angle: 'rad',
};

const FUNC_SPECS = {
  matrix: 'number*6',
  matrix3d: 'number*16',

  translate: 'length length?',
  translate3d: 'length*3',
  translateX: 'length',
  translateY: 'length',
  translateZ: 'length',

  scale: 'number number?',
  scale3d: 'number*3',
  scaleX: 'number',
  scaleY: 'number',
  scaleZ: 'number',

  rotate: 'angle',
  rotate3d: 'length*3 angle',
  rotateX: 'angle',
  rotateY: 'angle',
  rotateZ: 'angle',

  skew: 'angle angle?',
  skewX: 'angle',
  skewY: 'angle',

  perspective: 'length',
};

export class Builder {
  constructor() {
    this._builder = [];
  }

  toString() {
    return this._builder.join(' ');
  }
}

function parseArgSpecs(argSpec) {
  const tokens = argSpec.split(' ');
  const result = [];

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    let repeatCount = 1;

    const repeatMatch = /^([^*]+)\*(\d+)$/.exec(token);
    if (repeatMatch) {
      token = repeatMatch[1];
      repeatCount = repeatMatch[2] | 0;
    }

    const optional = token.slice(-1) === '?';
    if (optional) {
      token = token.slice(0, -1);
    }

    const descriptor = {
      type: token,
      unit: DEFAULT_UNITS[token] || '',
      optional,
    };

    for (let j = 0; j < repeatCount; j++) {
      result.push(descriptor);
    }
  }

  return result;
}

function makeStringFunc(name, argDescs) {
  return function (args) {
    let argString = '';

    for (let i = 0; i < argDescs.length; i++) {
      const arg = args[i];
      const desc = argDescs[i];

      if (desc.optional && arg == null) {
        break;
      }

      argString += ',' + arg;
      if (typeof arg === 'number') {
        argString += desc.unit;
      }
    }

    return name + '(' + argString.slice(1) + ')';
  };
}

// makeStringMethod creates methods for assigning to Builder.prototype, so tell
// the linter `this` is allowed outside a class/object literal context.

/* eslint-disable no-invalid-this */
function makeStringMethod(stringFunc) {
  return function (...args) {
    this._builder.push(stringFunc(args));
    return this;
  };
}
/* eslint-enable no-invalid-this */

function makeInitiatorFunction(methodName) {
  return function (...args) {
    const w = new Builder();
    return w[methodName](...args);
  };
}

function init(builderPrototype, moduleExports) {
  for (const funcName of Object.keys(FUNC_SPECS)) {
    const argDescs = parseArgSpecs(FUNC_SPECS[funcName]);
    const stringFunc = makeStringFunc(funcName, argDescs);
    builderPrototype[funcName] = makeStringMethod(stringFunc);
    moduleExports[funcName] = makeInitiatorFunction(funcName);
  }
}

init(Builder.prototype, { Builder });
