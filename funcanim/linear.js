import { linearCoefficientsPoints } from './lib/helpers';

export function linear(x0, y0, x1, y1) {
  const coeffs = [];
  const evaluator = {
    type: 'linear',

    // informational only: it's the coefficients array that defines the line.
    // this can be modified by calling set()
    x0: NaN,
    y0: NaN,
    x1: NaN,
    y1: NaN,

    coefficients: coeffs,

    set(nx0, ny0, nx1, ny1) {
      this.x0 = nx0;
      this.y0 = ny0;
      this.x1 = nx1;
      this.y1 = ny1;
      linearCoefficientsPoints(nx0, ny0, nx1, ny1, coeffs);
      return this;
    },

    evaluate(x) {
      return coeffs[0] * x + coeffs[1];
    },
  };

  return evaluator.set(x0, y0, x1, y1);
}

export function linearBySampling(func, x0, x1) {
  return linear(x0, func(x0), x1, func(x1));
}

export function toUnit(x0, x1) {
  return linear(x0, 0, x1, 1);
}

export function fromUnit(x0, x1) {
  return linear(0, x0, 1, x1);
}
