import { Key } from './key';
import { TRACK_EXTRAPOLATE_CLAMP, TRACK_EXTRAPOLATE_CONTINUE } from './consts';
import {
  linearCoefficientsPointDelta,
  linearCoefficientsPoints,
} from '../helpers';

function linearRate(a, b) {
  return (b._v - a._v) / (b._t - a._t);
}

function bsearch(keys, t) {
  let hi = keys.length - 1;
  let lo = 0;

  while (hi > lo + 1) {
    const mid = (lo + hi) >>> 1;
    if (t < keys[mid]._t) {
      hi = mid;
    } else if (t > keys[mid]._t) {
      lo = mid;
    } else {
      return mid;
    }
  }

  return lo;
}

export class ScalarTrack {
  constructor() {
    this.extrapolateBefore = TRACK_EXTRAPOLATE_CLAMP;
    this.extrapolateAfter = TRACK_EXTRAPOLATE_CLAMP;
    this._coeffBefore = [0, 0];
    this._coeffAfter = [0, 0];
    this._keys = [];
    this._changed = true;
    this._owner = null;
  }

  addKey() {
    const keys = this._keys;

    const newKey = new Key(this);

    // make sure ts remain sorted by adding an arbitrary increment to the last t.
    // this is just to maintain invariants - this value shouldn't be relied upon
    // and caller will almost definitely want to set t
    newKey._t = keys.length === 0 ? 0 : keys[keys.length - 1]._t + 20;

    keys.push(newKey);
    this._changed = true;
    return newKey;
  }

  getKey(index) {
    return this._keys[index];
  }

  removeKey(index) {
    const doomedKey = this._keys[index];
    if (doomedKey) {
      doomedKey._owner = null;
      this._keys.splice(index, 1);
      this._changed = true;
    }
    return this;
  }

  _recalculate() {
    const keys = this._keys;
    const lastKi = keys.length - 1;

    this._changed = false;
    let earlyKey, lateKey;

    for (let ki = 0; ki < lastKi; ki++) {
      earlyKey = keys[ki];
      if (earlyKey._changed) {
        earlyKey._changed = false;
      } else {
        continue;
      }
      lateKey = keys[ki + 1];

      if (isNaN(earlyKey._outdv) && isNaN(lateKey._indv)) {
        // linear segment
        earlyKey.evaluate = Key.prototype._evalLinear;

        linearCoefficientsPoints(
          earlyKey._t,
          earlyKey._v,
          lateKey._t,
          lateKey._v,
          earlyKey._linCoeffs
        );
      } else {
        // hermite segment (although one side may be 'linear')
        earlyKey.evaluate = Key.prototype._evalHermite;

        const dt = lateKey._t - earlyKey._t;
        const dv = lateKey._v - earlyKey._v;

        earlyKey._tmul = 1 / dt;
        earlyKey._v1 = lateKey._v;
        earlyKey._dv0 = isFinite(earlyKey._outdv) ? earlyKey._outdv * dt : dv;
        earlyKey._dv1 = isFinite(lateKey._indv) ? lateKey._indv * dt : dv;
      }
    }

    earlyKey = keys[0];
    lateKey = keys[1];
    if (isFinite(earlyKey._outdv)) {
      linearCoefficientsPointDelta(
        earlyKey._t,
        earlyKey._v,
        earlyKey._outdv,
        this._coeffBefore
      );
    } else {
      linearCoefficientsPoints(
        earlyKey._t,
        earlyKey._v,
        lateKey._t,
        lateKey._v,
        this._coeffBefore
      );
    }

    earlyKey = keys[lastKi - 1];
    lateKey = keys[lastKi];
    if (isFinite(lateKey._indv)) {
      linearCoefficientsPointDelta(
        lateKey._t,
        lateKey._v,
        lateKey._indv,
        this._coeffAfter
      );
    } else {
      linearCoefficientsPoints(
        earlyKey._t,
        earlyKey._v,
        lateKey._t,
        lateKey._v,
        this._coeffAfter
      );
    }
  }

  evaluate(t) {
    const keys = this._keys;
    const lastKi = keys.length - 1;

    switch (lastKi) {
      case -1:
        return NaN;
      case 0:
        return keys[0]._v;
    }

    if (this._changed) {
      this._recalculate();
    }

    if (t < keys[0]._t) {
      if (this.extrapolateBefore === TRACK_EXTRAPOLATE_CONTINUE) {
        return t * this._coeffBefore[0] + this._coeffBefore[1];
      }
      return keys[0]._v;
    }

    if (t > keys[lastKi]._t) {
      if (this.extrapolateAfter === TRACK_EXTRAPOLATE_CONTINUE) {
        return t * this._coeffAfter[0] + this._coeffAfter[1];
      }
      return keys[lastKi]._v;
    }

    const ki = bsearch(keys, t);
    return keys[ki].evaluate(t);
  }

  _sort() {
    const keys = this._keys;
    keys.sort((a, b) => a.t - b.t);
    for (let i = 0; i < keys.length; i++) {
      keys._index = i;
    }
  }

  _smoothInOutHermite(keyIndex) {
    const keys = this._keys;

    const subject = keys[keyIndex];
    const earlier = keys[keyIndex - 1] || subject;
    const later = keys[keyIndex + 1] || subject;

    const rate = linearRate(earlier, later);

    subject.setInOutHermite(rate, rate);
  }

  smoothAll() {
    const keys = this._keys;

    for (let ki = 0; ki < keys.length; ki++) {
      const subject = keys[ki];
      const earlier = keys[ki - 1] || subject;
      const later = keys[ki + 1] || subject;

      subject._indv = subject._outdv = linearRate(earlier, later);
      subject._changed = true;
    }
    this._changed = true;
    return this;
  }

  _keyChanged(keyIndex) {
    const keys = this._keys;
    const subject = keys[keyIndex];
    subject._changed = true;

    const before = keys[keyIndex - 1];
    if (before) {
      before._changed = true;
    }

    const after = keys[keyIndex + 1];
    if (after) {
      after._changed = true;
    }

    this._changed = true;
  }

  endTrack() {
    if (!this._owner) {
      throw new Error('This ScalarTrack is not part of any VectorTrack');
    }
    return this._owner;
  }
}
