'use strict';

class WordWrapper {
  constructor(width = 78, indent = '') {
    this._width = width;
    this._indent = indent;

    this._lines = [];
    this._line = [this._indent];
    this._lineLen = this._indent.length;
  }

  clear() {
    this._lines = [];
    this._line = [this._indent];
    this._lineLen = this._indent.length;
    return this;
  }

  write(thing) {
    const str = String(thing);
    if (str === '') {
      return this;
    }

    if (this._line.length > 1 && this._lineLen + str.length > this._width) {
      this.lf();
    }

    this._line.push(str);
    this._lineLen += str.length;
    return this;
  }

  _lineText() {
    return this._line.join('').replace(/\s+$/, '');
  }

  lf() {
    this._lines.push(this._lineText());
    this._line = [this._indent];
    this._lineLen = this._indent.length;
    return this;
  }

  toString() {
    let str = '';
    if (this._lines.length > 0) {
      str = this._lines.join('\n') + '\n';
    }
    return str + this._lineText();
  }
}

module.exports = WordWrapper;
