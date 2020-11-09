export const repeat = {
  type: 'repeat',
  evaluate(x) {
    return x - Math.floor(x);
  },
};

export const pingPong = {
  type: 'pingPong',
  evaluate(x) {
    const i = Math.floor(x);
    const f = x - i;
    return i & 1 ? 1 - f : f;
  },
};

export function min(threshold) {
  return {
    type: 'min',
    threshold,
    evaluate(x) {
      return x < this.threshold ? x : this.threshold;
    },
  };
}

export function max(threshold) {
  return {
    type: 'max',
    threshold,
    evaluate(x) {
      return x > this.threshold ? x : this.threshold;
    },
  };
}

export function clamp(low, high) {
  return {
    type: 'clamp',
    low,
    high,
    evaluate(x) {
      return x < this.low ? this.low : x > this.high ? this.high : x;
    },
  };
}
