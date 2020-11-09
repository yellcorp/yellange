import { ScalarTrack } from './scalar';
import { VectorKeyProxy } from './vectorkeyproxy';

export class VectorTrack {
  constructor(dimension) {
    this._dimension = dimension;
    this._tracks = new Array(dimension);
    this._result = new Array(dimension);

    for (let i = 0; i < dimension; i++) {
      const track = (this._tracks[i] = new ScalarTrack());
      track._owner = this;
    }
  }

  addKey() {
    const dimension = this._dimension;
    const tracks = this._tracks;
    const keys = new Array(dimension);
    for (let i = 0; i < dimension; i++) {
      keys[i] = tracks[i].addKey();
    }
    return new VectorKeyProxy(this, keys);
  }

  getKey(index) {
    const dimension = this._dimension;
    const tracks = this._tracks;
    const keys = new Array(dimension);
    for (let i = 0; i < dimension; i++) {
      keys[i] = tracks[i].getKey(index);
    }
    return new VectorKeyProxy(this, keys);
  }

  removeKey(index) {
    const dimension = this._dimension;
    const tracks = this._tracks;
    for (let i = 0; i < dimension; i++) {
      tracks[i].removeKey(index);
    }
    return this;
  }

  evaluate(t) {
    const dimension = this._dimension;
    const tracks = this._tracks;
    const result = this._result;
    for (let i = 0; i < dimension; i++) {
      result[i] = tracks[i].evaluate(t);
    }
    return result;
  }

  smoothAll() {
    const dimension = this._dimension;
    const tracks = this._tracks;
    for (let i = 0; i < dimension; i++) {
      tracks[i].smoothAll();
    }
    return this;
  }

  getTrack(dimensionIndex) {
    return this._tracks[dimensionIndex] || null;
  }
}
