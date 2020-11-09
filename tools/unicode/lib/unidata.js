'use strict';

const eachStreamLine = require('./eachStreamLine');

const MAX_UNICODE = 0x10ffff;
const UNICODE_COUNT = MAX_UNICODE + 1;

function parseRange(rangeString) {
  const match = /^([0-9a-f]{4,6})(?:\.\.([0-9a-f]{4,6}))?$/i.exec(rangeString);
  if (!match) {
    throw new Error('Not a unicode range string');
  }

  const first = parseInt(match[1], 16);
  let last = first;
  if (match[2]) {
    last = parseInt(match[2], 16);
    if (last < first) {
      throw new Error('Reversed range');
    }
  }

  return [first, last + 1];
}

function parseRangeSet(rangeSetString) {
  const ranges = rangeSetString.trim().split(/\s+/).map(parseRange);
  return ranges;
}

function normalizeLine(line) {
  const hashPos = line.indexOf('#');
  if (hashPos >= 0) {
    line = line.slice(0, hashPos);
  }
  return line.replace(/\s+$/, '');
}

function splitFields(line) {
  line = normalizeLine(line);
  if (!line) return [];
  const fields = (';' + line + ';').split(/\s*;\s*/);
  fields.pop();
  fields.shift();
  return fields;
}

function splitFieldsWithLeadingCodepoints(line) {
  const fields = splitFields(line);
  if (fields.length > 0) {
    fields[0] = parseRangeSet(fields[0]);
  }
  return fields;
}

class Enum {
  constructor() {
    this._nameToNumber = {};
    this._numberToName = [];
  }

  get length() {
    return this._numberToName.length;
  }

  hasName(name) {
    return Object.prototype.hasOwnProperty.call(this._nameToNumber, name);
  }

  addName(newName) {
    if (!this.hasName(newName)) {
      this._nameToNumber[newName] = this._numberToName.length;
      this._numberToName.push(newName);
    }
    return this._nameToNumber[newName];
  }

  getName(number) {
    return number < this._numberToName.length
      ? this._numberToName[number]
      : null;
  }

  getNumber(name) {
    return this.hasName(name) ? this._nameToNumber[name] : NaN;
  }

  getNameToNumberLookup() {
    return Object.assign({}, this._nameToNumber);
  }

  getNames() {
    return this._numberToName.slice();
  }
}

class EnumParser {
  constructor(defaultString) {
    this._values = new Uint8Array(UNICODE_COUNT);
    this._enum = new Enum();
    this._enum.addName(defaultString);
  }

  get values() {
    return this._values;
  }

  get enum() {
    return this._enum;
  }

  parseLine(line) {
    const [ranges, enumString] = splitFieldsWithLeadingCodepoints(line);
    if (!ranges) return;

    const value = this._enum.addName(enumString);
    for (const [start, end] of ranges) {
      this._values.fill(value, start, end);
    }
  }
}

function parseEnumDataStream(stream, defaultString) {
  const parser = new EnumParser(defaultString);
  return eachStreamLine(stream, parser.parseLine.bind(parser)).then(
    () => parser
  );
}

module.exports = {
  parseRange,
  parseRangeSet,

  normalizeLine,
  splitFields,
  splitFieldsWithLeadingCodepoints,

  Enum,
  EnumParser,
  parseEnumDataStream,
};
