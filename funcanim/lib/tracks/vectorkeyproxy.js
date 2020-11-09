export class VectorKeyProxy {
  constructor(owner, keyArray) {
    this._owner = owner;
    this._keys = keyArray;
  }

  setT(t) {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].setT(t);
    }
    return this;
  }

  setV(vArray) {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].setV(vArray[i]);
    }
    return this;
  }

  setTV(t, vArray) {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].setTV(t, vArray[i]);
    }
    return this;
  }

  setInLinear() {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].setInLinear();
    }
    return this;
  }

  setOutLinear() {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].setOutLinear();
    }
    return this;
  }

  setInOutLinear() {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].setInOutLinear();
    }
    return this;
  }

  setInHermite(inRates) {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].setInHermite(inRates[i]);
    }
    return this;
  }

  setOutHermite(outRates) {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].setOutHermite(outRates[i]);
    }
    return this;
  }

  setInOutHermite(inRates, outRates) {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].setInOutHermite(inRates[i], outRates[i]);
    }
    return this;
  }

  setInToOut() {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].setInToOut();
    }
    return this;
  }

  setOutToIn() {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].setOutToIn();
    }
    return this;
  }

  smoothInOutHermite() {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].smoothInOutHermite();
    }
    return this;
  }

  endKey() {
    return this._owner;
  }

  remove() {
    const keys = this._keys;
    for (let i = 0; i < keys.length; i++) {
      keys[i].remove();
    }
    this._keys = null;
    return this._owner;
  }
}
