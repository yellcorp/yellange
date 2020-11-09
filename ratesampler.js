/**
 * @file ratesampler: Measure the rate of sampled scalar or vector values.
 *
 * Used for download UI and inertial scrolling, to name two.
 */

function allNaNs(array) {
  for (let i = 0; i < array.length; i++) {
    array[i] = NaN;
  }
  return array;
}

export class RateSampler {
  constructor(dimensionCount, sampleCount) {
    this._dimensionCount = dimensionCount;
    this._sampleCount = sampleCount;
    this._stride = dimensionCount + 1;

    this._data = new Array(this._stride * sampleCount);

    this.clear();
  }

  clear() {
    allNaNs(this._data);
    this._pointer = -this._stride;
  }

  sample(time, ...dimensionSamples) {
    this._pointer += this._stride;
    if (this._pointer === this._data.length) {
      this._pointer = 0;
    }

    this._data[this._pointer] = time;
    for (let i = 0; i < this._dimensionCount; i++) {
      this._data[this._pointer + i + 1] = dimensionSamples[i];
    }
  }

  getRateScalar(dimensionIndex) {
    if (this._pointer < 0) {
      return NaN;
    }

    let last = this._pointer;
    let first = this._pointer + this._stride;
    if (first === this._data.length || !isFinite(this._data[first])) {
      first = 0;
    }

    const dt = this._data[last++] - this._data[first++];
    const dv =
      this._data[last + dimensionIndex] - this._data[first + dimensionIndex];

    return dv / dt;
  }

  getRateVector(outArray) {
    if (!outArray) {
      outArray = new Array(this._dimensionCount);
    }

    if (this._pointer < 0) {
      return allNaNs(outArray);
    }

    let last = this._pointer;
    let first = last + this._stride;
    if (first === this._data.length || !isFinite(this._data[first])) {
      first = 0;
    }

    const dt = this._data[last++] - this._data[first++];
    for (let i = 0; i < outArray.length; i++) {
      outArray[i] = (this._data[last++] - this._data[first++]) / dt;
    }

    return outArray;
  }

  get dimensionCount() {
    return this._dimensionCount;
  }

  get sampleCount() {
    return this._sampleCount;
  }
}
