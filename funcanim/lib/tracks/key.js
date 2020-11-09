import { unitHermite } from '../../../math';

export class Key {
  constructor(owner) {
    this._owner = owner;

    // primary values
    this._t = this._v = this._indv = this._outdv = NaN;

    this._index = 0;

    this._changed = true;
    // cached derived values
    // for linear interpolation
    this._linCoeffs = [0, 0];

    // for hermite interpolation
    this._tmul = this._v1 = this._dv0 = this._dv1 = NaN;

    this.evaluate = this._evalLinear;
  }

  setT(t) {
    if (t !== this._t) {
      this._t = t;
      this._owner._sort();
    }
    this._notifyChange();
    return this;
  }

  setV(v) {
    this._v = v;
    this._notifyChange();
    return this;
  }

  setTV(t, v) {
    if (t !== this._t) {
      this._t = t;
      this._owner._sort();
    }
    this._v = v;
    this._notifyChange();
    return this;
  }

  setInLinear() {
    this._indv = NaN;
    this._notifyChange();
    return this;
  }

  setOutLinear() {
    this._outdv = NaN;
    this._notifyChange();
    return this;
  }

  setInOutLinear() {
    this._indv = this._outdv = NaN;
    this._notifyChange();
    return this;
  }

  setInHermite(rate) {
    this._indv = rate;
    this._notifyChange();
    return this;
  }

  setOutHermite(rate) {
    this._outdv = rate;
    this._notifyChange();
    return this;
  }

  setInOutHermite(inRate, outRate) {
    this._indv = inRate;
    this._outdv = outRate;
    this._notifyChange();
    return this;
  }

  setInToOut() {
    this._indv = this._outdv;
    this._notifyChange();
    return this;
  }

  setOutToIn() {
    this._outdv = this._indv;
    this._notifyChange();
    return this;
  }

  smoothInOutHermite() {
    this._owner._smoothInOutHermite(this._index);
    return this;
  }

  endKey() {
    return this._owner;
  }

  remove() {
    return this._owner.removeKey(this._index);
  }

  _evalLinear(t) {
    return t * this._linCoeffs[0] + this._linCoeffs[1];
  }

  _evalHermite(t) {
    return unitHermite(
      this._v,
      this._dv0,
      this._v1,
      this._dv1,
      (t - this._t) * this._tmul
    );
  }

  _notifyChange() {
    this._owner._keyChanged(this._index);
  }
}
