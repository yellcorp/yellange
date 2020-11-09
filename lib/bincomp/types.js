import { utf8Decode, utf8Encode } from '../../unicode/utf8';

export class BytePrimitiveType {
  constructor(name, getter, setter) {
    this.name = name;
    this.size = 1;
    this._getter = getter;
    this._setter = setter;
  }

  unpack(dataView, offset, _littleEndian) {
    return this._getter.call(dataView, offset);
  }

  pack(dataView, offset, value, _littleEndian) {
    this._setter.call(dataView, offset, value);
  }
}

export class MultibytePrimitiveType {
  constructor(name, getter, setter, size) {
    this.name = name;
    this.size = size;
    this._getter = getter;
    this._setter = setter;
  }

  unpack(dataView, offset, littleEndian) {
    return this._getter.call(dataView, offset, littleEndian);
  }

  pack(dataView, offset, value, littleEndian) {
    this._setter.call(dataView, offset, value, littleEndian);
  }
}

export class ArrayType {
  constructor(memberType, count) {
    this._memberType = memberType;
    this._count = count;
    this.name = this._memberType.name + '[]';
    this.size = this._memberType.size * count;
  }

  unpack(dataView, offset, littleEndian) {
    const array = [];
    for (let i = 0; i < this._count; i++, offset += this._memberType.size) {
      array.push(this._memberType.unpack(dataView, offset, littleEndian));
    }
    return array;
  }

  pack(dataView, offset, value, littleEndian) {
    for (let i = 0; i < this._count; i++, offset += this._memberType.size) {
      this._memberType.pack(dataView, offset, value[i], littleEndian);
    }
  }
}

export class StringUTF8Type {
  constructor(arrayType) {
    this._arrayType = arrayType;
    this.name = arrayType.name;
    this.size = arrayType.size;
  }

  unpack(dataView, offset, littleEndian) {
    const fullString = utf8Decode(
      this._arrayType.unpack(dataView, offset, littleEndian)
    );

    const nullIndex = fullString.indexOf('\x00');
    if (nullIndex >= 0) {
      return fullString.slice(0, nullIndex);
    }

    return fullString;
  }

  pack(dataView, offset, value, littleEndian) {
    const bytes = utf8Encode(value);
    while (bytes.length < this.size) {
      bytes.push(0);
    }
    this._arrayType.pack(dataView, offset, bytes, littleEndian);
  }
}
