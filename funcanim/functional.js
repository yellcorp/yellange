export function composition(evaluatorsArray) {
  const myEvaluators = evaluatorsArray || [];
  return {
    type: 'composition',
    evaluators: myEvaluators,
    evaluate(arg) {
      for (let i = 0; i < myEvaluators.length; i++) {
        arg = myEvaluators[i].evaluate(arg);
      }
      return arg;
    },
  };
}

export function wrap(plainFunction, thisArg) {
  return {
    type: 'wrap',
    func: plainFunction,
    boundThis: thisArg,
    evaluate() {
      // apply is used here to force a different this argument, but I don't
      // think ESLint realizes that
      // eslint-disable-next-line prefer-rest-params
      return this.func.apply(this.boundThis, arguments);
    },
  };
}

/**
 * Converts an evaluator that takes a single scalar argument to one that takes
 * an array. The wrapped evaluator is applied to each member of the array.
 */
export function vectorize(dimension, evaluator) {
  const result = new Array(dimension);
  return {
    type: 'vectorize',
    evaluate(v) {
      for (let i = 0; i < dimension; i++) {
        result[i] = evaluator.evaluate(v[i]);
      }
      return result;
    },
  };
}

export function constant(k) {
  return {
    type: 'constant',
    value: k,
    evaluate(_) {
      return this.value;
    },
  };
}

export const identity = {
  type: 'identity',
  evaluate(v) {
    return v;
  },
};
