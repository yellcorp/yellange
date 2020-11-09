export function propertiesToArray(propertyNames) {
  const myProps = propertyNames.slice();
  const len = propertyNames.length;
  const result = new Array(len);
  return {
    type: 'propertiesToArray',
    propertyNames,
    evaluate(obj) {
      for (let i = 0; i < len; i++) {
        result[i] = obj[myProps[i]];
      }
      return result;
    },
  };
}
export const toArray2D = propertiesToArray(['x', 'y']);
export const toArray3D = propertiesToArray(['x', 'y', 'z']);
export const toArray4D = propertiesToArray(['x', 'y', 'z', 'w']);

export function arrayToProperties(propertyNames, useObject) {
  const myProps = propertyNames.slice();
  const len = propertyNames.length;
  const result = useObject || {};
  return {
    type: 'arrayToProperties',
    propertyNames,
    evaluate(arr) {
      for (let i = 0; i < len; i++) {
        result[myProps[i]] = arr[i];
      }
      return result;
    },
  };
}
export const fromArray2D = arrayToProperties(['x', 'y']);
export const fromArray3D = arrayToProperties(['x', 'y', 'z']);
export const fromArray4D = arrayToProperties(['x', 'y', 'z', 'w']);

export const toCSSRGB = {
  type: 'toCSSRGB',
  evaluate(v) {
    return (
      'rgb(' +
      (v[0] < 0 ? 0 : v[0] > 1 ? 1 : (v[0] * 255) | 0) +
      ',' +
      (v[1] < 0 ? 0 : v[1] > 1 ? 1 : (v[1] * 255) | 0) +
      ',' +
      (v[2] < 0 ? 0 : v[2] > 1 ? 1 : (v[2] * 255) | 0) +
      ')'
    );
  },
};

export const toCSSRGBA = {
  type: 'toCSSRGBA',
  evaluate(v) {
    return (
      'rgba(' +
      (v[0] < 0 ? 0 : v[0] > 1 ? 1 : (v[0] * 255) | 0) +
      ',' +
      (v[1] < 0 ? 0 : v[1] > 1 ? 1 : (v[1] * 255) | 0) +
      ',' +
      (v[2] < 0 ? 0 : v[2] > 1 ? 1 : (v[2] * 255) | 0) +
      ',' +
      (v[3] < 0 ? 0 : v[3] > 1 ? 1 : v[3]) +
      ')'
    );
  },
};

export const toCSSHSL = {
  type: 'toCSSHSL',
  evaluate(v) {
    return (
      'hsl(' +
      (v[0] - Math.floor(v[0])) * 360 +
      ',' +
      (v[1] < 0 ? 0 : v[1] > 1 ? 1 : (v[1] * 100) | 0) +
      '%,' +
      (v[2] < 0 ? 0 : v[2] > 1 ? 1 : (v[2] * 100) | 0) +
      '%)'
    );
  },
};

export const toCSSHSLA = {
  type: 'toCSSHSLA',
  evaluate(v) {
    return (
      'hsla(' +
      (v[0] - Math.floor(v[0])) * 360 +
      ',' +
      (v[1] < 0 ? 0 : v[1] > 1 ? 1 : (v[1] * 100) | 0) +
      '%,' +
      (v[2] < 0 ? 0 : v[2] > 1 ? 1 : (v[2] * 100) | 0) +
      '%,' +
      (v[3] < 0 ? 0 : v[3] > 1 ? 1 : v[3]) +
      ')'
    );
  },
};

export const packRGB = {
  type: 'packRGB',
  evaluate(v) {
    return (v[0] << 16) | (v[1] << 8) | v[2];
  },
};
