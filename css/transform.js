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

const DEFAULT_UNITS = {
  length: 'px',
  angle: 'rad',
};

const ARG_MEMO = {};
const FORMATTER_MEMO = {};

function parseArgDescriptors(argDescString) {
  const tokens = argDescString.split(' ');
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

function makeFormatter(name, argDescs) {
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

export class Builder {
  constructor() {
    this._transform = [];
  }

  _push(cssFunctionName, argDesc, args) {
    let renderer = FORMATTER_MEMO[cssFunctionName];
    if (!renderer) {
      const parsedArgDescs =
        ARG_MEMO[argDesc] || (ARG_MEMO[argDesc] = parseArgDescriptors(argDesc));
      renderer = FORMATTER_MEMO[cssFunctionName] = makeFormatter(
        cssFunctionName,
        parsedArgDescs
      );
    }
    this._transform.push(renderer(args));
    return this;
  }

  matrix(...a) {
    return this._push('matrix', 'number*6', a);
  }
  matrix3d(...a) {
    return this._push('matrix3d', 'number*16', a);
  }

  translate(...a) {
    return this._push('translate', 'length length?', a);
  }
  translate3d(...a) {
    return this._push('translate3d', 'length*3', a);
  }
  translateX(...a) {
    return this._push('translateX', 'length', a);
  }
  translateY(...a) {
    return this._push('translateY', 'length', a);
  }
  translateZ(...a) {
    return this._push('translateZ', 'length', a);
  }

  scale(...a) {
    return this._push('scale', 'number number?', a);
  }
  scale3d(...a) {
    return this._push('scale3d', 'number*3', a);
  }
  scaleX(...a) {
    return this._push('scaleX', 'number', a);
  }
  scaleY(...a) {
    return this._push('scaleY', 'number', a);
  }
  scaleZ(...a) {
    return this._push('scaleZ', 'number', a);
  }

  rotate(...a) {
    return this._push('rotate', 'angle', a);
  }
  rotate3d(...a) {
    return this._push('rotate3d', 'length*3 angle', a);
  }
  rotateX(...a) {
    return this._push('rotateX', 'angle', a);
  }
  rotateY(...a) {
    return this._push('rotateY', 'angle', a);
  }
  rotateZ(...a) {
    return this._push('rotateZ', 'angle', a);
  }

  skew(...a) {
    return this._push('skew', 'angle angle?', a);
  }
  skewX(...a) {
    return this._push('skewX', 'angle', a);
  }
  skewY(...a) {
    return this._push('skewY', 'angle', a);
  }

  perspective(...a) {
    return this._push('perspective', 'length', a);
  }

  toString() {
    return this._transform.join(' ');
  }
}

function startWith(methodName, args) {
  return new Builder()[methodName](...args);
}

export const matrix = (...a) => startWith('matrix', a);
export const matrix3d = (...a) => startWith('matrix3d', a);

export const translate = (...a) => startWith('translate', a);
export const translate3d = (...a) => startWith('translate3d', a);
export const translateX = (...a) => startWith('translateX', a);
export const translateY = (...a) => startWith('translateY', a);
export const translateZ = (...a) => startWith('translateZ', a);

export const scale = (...a) => startWith('scale', a);
export const scale3d = (...a) => startWith('scale3d', a);
export const scaleX = (...a) => startWith('scaleX', a);
export const scaleY = (...a) => startWith('scaleY', a);
export const scaleZ = (...a) => startWith('scaleZ', a);

export const rotate = (...a) => startWith('rotate', a);
export const rotate3d = (...a) => startWith('rotate3d', a);
export const rotateX = (...a) => startWith('rotateX', a);
export const rotateY = (...a) => startWith('rotateY', a);
export const rotateZ = (...a) => startWith('rotateZ', a);

export const skew = (...a) => startWith('skew', a);
export const skewX = (...a) => startWith('skewX', a);
export const skewY = (...a) => startWith('skewY', a);

export const perspective = (...a) => startWith('perspective', a);
