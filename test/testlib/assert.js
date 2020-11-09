import assert from 'assert';

function element(name, index) {
  return name + (index == null ? '' : ` at index ${index}`);
}

function getTolerance(source, index) {
  let tol;
  if (Array.isArray(source)) {
    tol = source[index];
  } else {
    index = null;
    tol = source;
  }

  if (tol == null || isNaN(tol)) {
    throw new Error(
      element('Tolerance', index) +
        ' must be a number, but is ' +
        Object.prototype.toString.call(tol) +
        ' ' +
        tol
    );
  }

  if (tol < 0) {
    throw new Error(message + ' must be positive, but is ' + tol);
  }

  return tol;
}

export function floatArraysEqualWithin(tolerance) {
  return (actual, expected) => {
    assert.strictEqual(
      Object.prototype.toString.call(actual),
      '[object Array]'
    );

    assert.strictEqual(
      actual.length,
      expected.length,
      `Array length ${actual.length} === ${expected.length}`
    );

    for (let i = 0; i < expected.length; i++) {
      const elementTolerance = getTolerance(tolerance, i);

      if (Math.abs(actual[i] - expected[i]) > elementTolerance) {
        assert.fail(
          actual[i],
          expected[i],
          `Element at index ${i} exceeds tolerance of ${elementTolerance}`,
          'floatArraysEqualWithin',
          floatArraysEqualWithin
        );
      }
    }
  };
}
