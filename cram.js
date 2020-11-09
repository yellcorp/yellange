/**
 * @file cram: Compact Representation of Arbitrary Mmmdata
 *
 * # Summary
 *
 * Crams a JSON-compatible object graph into a small blob of binary data, and
 * vice versa.
 *
 * This is achieved through identifying recurring sets of keys among
 * dictionaries/mappings/objects (called schema) within the graph, and storing
 * them once. Strings are also stored once. This means the minifying effect is
 * most pronounced for data sets containing arrays of similarly-structured
 * dictionaries.
 *
 * There's no compression of the resulting binary data - run it through zlib to
 * compact it even further. Base64 it to have your data compactly encoded in a
 * text-safe manner.
 *
 * As of v0.0.1 there's no cycle detection, so those will quickly overflow your
 * stack.
 *
 * Somewhat based on, but incompatible with [`msgpack`](http://msgpack.org).
 *
 * # Spec
 *
 * - All numbers are stored little-endian.
 * - All indices are zero-based.
 * - In data tables (described later), integers have a specific representation
 *   called a `VaryLengthUint`. This is a variable-length sequence of bytes - 1
 *   at minimum, each of which contributes its lowest 7 bits to the encoded
 *   number, with its highest bit (`0x80`) set if more bytes follow, unset if
 *   it is the terminal byte. In the first byte, bits 0-6 map to bits 0-6 of
 *   the result value in the same order. In the second byte, if present, bits
 *   0-6 map to bits 7-13 of the result value, and so on.
 *
 *   ```
 *   result = (byte[0] & 0x7F)
 *            | ((byte[1] & 0x7F) << 7)
 *            | ((byte[2] & 0x7F) << 14)
 *            | ...
 *            | ((byte[n] & 0x7F) << (7 * n))
 *   ```
 * - Strings are encoded as follows. Nulls are permitted.
 *   - `VaryLengthUint byteCount` - The number of bytes in the UTF-8 *
 *      representation of the string.
 *   - `uint8[byteCount] string` - The UTF-8 bytes of the string.
 *
 *   Note that it is possible to store a zero-length string (`""`), in which
 *   case it is encoded as a length of 0 with no bytes following.
 *
 * The binary stream consists of 4 sections in the following order, each
 * immediately following the other.
 *
 * ## Header
 *
 * The bytes `0x59`, `0x63`, `0x72`, followed by a single unsigned byte
 * representing the version number. Currently the only version is 1.
 *
 * ## String table
 *
 * Strings in the schema table and the encoded object graph (both described
 * later) are stored once here and then later referred to by index. The first
 * string has an index of 0.
 *
 * - `VaryLengthUint stringCount` - The number of strings in the string table.
 * - `String[stringCount] string` - The strings comprising the table.
 *
 * ## Schema table
 *
 * This table stores each schema used by the object graph. Conceptually, this
 * is an array of arrays of strings.
 *
 * - `VaryLengthUint schemaCount` - The number of schema in the table.
 * - `schemaCount` repetitions of:
 *   - `VaryLengthUint keyCount` - The number of keys in the schema.
 *   - `VaryLengthUint[keyCount] stringIndices` - The keys in the schema,
 *     expressed as a sequence of indices into the string table.
 *
 * ## Object graph
 *
 * The encoded data. The type of each value can be inferred from the byte that
 * precedes it. Some representations encode both the type and value in a single
 * byte. A lot of this is borrowed from [`msgpack`](http://msgpack.org),
 * differences are formatted *thus*.
 *
 * Note that `VaryLengthUint` encoding is *not* used in the object graph.
 *
 * | Lead byte (hex) | (binary)   | Meaning |
 * | --------------- | ---------- | ------- |
 * | `00 - 7F`       | `0xxxxxxx` | Unsigned integer, 0 - 127 |
 * | `80 - 8F`       | `1000xxxx` | Mapping *using schema index 0 - 15* |
 * | `90 - 9F`       | `1001xxxx` | Array with 0 - 15 elements |
 * | `A0 - BF`       | `101xxxxx` | String *at index 0 - 31* |
 * | `C0`            | `11000000` | `null` |
 * | `C1`            | `11000001` | *`undefined`* |
 * | `C2`            | `11000010` | `false` |
 * | `C3`            | `11000011` | `true` |
 * | `C4`            | `11000100` | *not implemented* (bin 8 in msgpack) |
 * | `C5`            | `11000101` | *not implemented* (bin 16 in msgpack) |
 * | `C6`            | `11000110` | *not implemented* (bin 32 in msgpack) |
 * | `C7`            | `11000111` | *Array with 16 - 271 elements. Length is a `uint8` biased by 16.* |
 * | `C8`            | `11001000` | *Mapping using schema index 16 - 271. Index is a `uint8` biased by 16.* |
 * | `C9`            | `11001001` | *not implemented* (available in msgpack) |
 * | `CA`            | `11001010` | float32 |
 * | `CB`            | `11001011` | float64 |
 * | `CC`            | `11001100` | uint8 |
 * | `CD`            | `11001101` | uint16 |
 * | `CE`            | `11001110` | uint32 |
 * | `CF`            | `11001111` | *not implemented* (uint 64 in msgpack) |
 * | `D0`            | `11010000` | int8 |
 * | `D1`            | `11010001` | int16 |
 * | `D2`            | `11010010` | int32 |
 * | `D3`            | `11010011` | *not implemented* (int 64 in msgpack) |
 * | `D4`            | `11010100` | *not implemented* (available in msgpack) |
 * | `D5`            | `11010101` | *not implemented* (available in msgpack) |
 * | `D6`            | `11010110` | *not implemented* (available in msgpack) |
 * | `D7`            | `11010111` | *not implemented* (available in msgpack) |
 * | `D8`            | `11011000` | *not implemented* (available in msgpack) |
 * | `D9`            | `11011001` | String *at index 32 - 287. Index is a `uint8` biased by 32.* |
 * | `DA`            | `11011010` | String *at index 288 - 65823. Index is a `uint16` biased by 288.* |
 * | `DB`            | `11011011` | String *at index 65824 - 4295033119. Index is a `uint32` biased by 65824.* |
 * | `DC`            | `11011100` | Array with *272 - 65807* elemenets. Length is a `uint16` *biased by 272.* |
 * | `DD`            | `11011101` | Array with *65808 - 4295033104* elemenets. Length is a `uint32` *biased by 65808.* |
 * | `DE`            | `11011110` | Mapping *using schema index 272 - 65807. Index is a `uint16` biased by 272.* |
 * | `DF`            | `11011111` | Mapping *using schema index 65808 - 4295033104. Index is a `uint32` biased by 65808.* |
 * | `E0 - FF`       | `111xxxxx` | Signed integer, -32 - -1 |
 *
 * Mappings are stored as a sequence of values, their length and corresponding
 * key inferred from the length and order of keys in their schema.
 *
 * A number that is *biased* by a value *x* must have x added when read, and
 * subtracted when written.
 *
 * ## TODO
 *
 * - Handle invalid data better
 * - Implement arbitrary binary data (types `0xC4-0xC6`)
 * - Tests
 * - JS/ESDoc
 */
import { HashMap } from './hashmap';
import { ReadStream, WriteStream } from './abstream';
import { isArrayLike } from './lang';
import { utf8Decode, utf8Encode } from './unicode/utf8';
import { zip } from './dictionary';

const hasOwn = Object.prototype.hasOwnProperty;
const MAGIC_V1 = 0x01726359;

function shallowArrayEquals(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function readVaryLengthUint(stream) {
  let value = 0;
  let shift = 0;
  let b = 0;
  do {
    b = stream.readByte();
    value |= (b & 0x7f) << shift;
    shift += 7;
  } while (b & 0x80);

  return value;
}

function readStringTable(reader) {
  const strings = [];
  const stringCount = readVaryLengthUint(reader);
  for (let i = 0; i < stringCount; i++) {
    const byteCount = readVaryLengthUint(reader);
    const bytes = [];
    reader.readBytes(byteCount, bytes);
    strings[i] = utf8Decode(bytes);
  }
  return strings;
}

function readSchemas(reader, strings) {
  const keySets = [];

  const schemaCount = readVaryLengthUint(reader);
  for (let i = 0; i < schemaCount; i++) {
    const keyCount = readVaryLengthUint(reader);
    const keys = (keySets[i] = []);
    for (let j = 0; j < keyCount; j++) {
      const index = readVaryLengthUint(reader);
      keys[j] = strings[index];
    }
  }

  return keySets;
}

class CramReader {
  constructor() {
    this._reader = null;
  }

  readGraph(binaryData) {
    this._reader = new ReadStream(binaryData);
    this._reader.littleEndian = true;

    // todo: throw if not MAGIC_V1
    const header = this._reader.readUint32();

    this._strings = readStringTable(this._reader);
    this._schemaKeySets = readSchemas(this._reader, this._strings);
    return this._readValue();
  }

  _readValue() {
    const b = this._reader.readByte();

    if (b <= 0x7f) {
      return b;
    }

    if (b <= 0x8f) {
      return this._readMapping(b & 0x0f);
    }

    if (b <= 0x9f) {
      return this._readArray(b & 0x0f);
    }

    if (b <= 0xbf) {
      return this._strings[b & 0x1f];
    }

    switch (b) {
      case 0xc0:
        return null;
      case 0xc1:
        return undefined;
      case 0xc2:
        return true;
      case 0xc3:
        return false;

      case 0xc7:
        return this._readArray(this._reader.readByte() + 0x10);
      case 0xc8:
        return this._readMapping(this._reader.readByte() + 0x10);

      case 0xca:
        return this._reader.readFloat32();
      case 0xcb:
        return this._reader.readFloat64();

      case 0xcc:
        return this._reader.readUint8();
      case 0xcd:
        return this._reader.readUint16();
      case 0xce:
        return this._reader.readUint32();

      case 0xd0:
        return this._reader.readInt8();
      case 0xd1:
        return this._reader.readInt16();
      case 0xd2:
        return this._reader.readInt32();

      case 0xd9:
        return this._strings[this._reader.readByte() + 0x20];
      case 0xda:
        return this._strings[this._reader.readUint16() + 0x120];
      case 0xdb:
        return this._strings[this._reader.readUint32() + 0x10120];

      case 0xdc:
        return this._readArray(this._reader.readUint16() + 0x110);
      case 0xdd:
        return this._readArray(this._reader.readUint32() + 0x10110);

      case 0xde:
        return this._readMapping(this._reader.readUint16() + 0x110);
      case 0xdf:
        return this._readMapping(this._reader.readUint32() + 0x10110);
    }

    return b - 256;
  }

  _readMapping(schemaIndex) {
    const keys = this._schemaKeySets[schemaIndex];
    const values = this._readArray(keys.length);
    return zip(keys, values);
  }

  _readArray(length) {
    const a = [];
    for (let i = 0; i < length; i++) {
      a[i] = this._readValue();
    }
    return a;
  }
}

function writeVaryLengthUint(stream, value) {
  do {
    const b = value & 0x7f;
    value >>>= 7;
    stream.writeByte(value > 0 ? b | 0x80 : b);
  } while (value);
}

const floatTest = new DataView(new ArrayBuffer(4));

function canRepresentFloatAsSingle(n) {
  if (!isFinite(n)) {
    return true;
  }
  floatTest.setFloat32(0, n);
  return n === floatTest.getFloat32(0);
}

function writeFloat(stream, value) {
  if (canRepresentFloatAsSingle(value)) {
    stream.writeByte(0xca);
    return stream.writeFloat32(value);
  }
  stream.writeByte(0xcb);
  return stream.writeFloat64(value);
}

function writeInteger(stream, value) {
  if (value >= 0 && value <= 0x7f) {
    return stream.writeByte(value);
  }

  if (value < 0) {
    if (value >= -128) {
      if ((value & 0xe0) === 0xe0) {
        return stream.writeByte(value & 0xff);
      }
      stream.writeByte(0xd0);
      return stream.writeInt8(value);
    }

    if (value >= -32768) {
      stream.writeByte(0xd1);
      return stream.writeInt16(value);
    }

    if (value >= -2147483648) {
      stream.writeByte(0xd2);
      return stream.writeInt32(value);
    }
  } else {
    if (value <= 0xff) {
      stream.writeByte(0xcc);
      return stream.writeUint8(value);
    }

    if (value <= 0xffff) {
      stream.writeByte(0xcd);
      return stream.writeUint16(value);
    }

    if (value <= 0xffffffff) {
      stream.writeByte(0xce);
      return stream.writeUint32(value);
    }
  }

  return writeFloat(stream, value);
}

function writeSemanticUint(
  stream,
  value,
  singleByteBits,
  singleByteMask,
  u8marker,
  u16marker,
  u32marker
) {
  if (value <= singleByteMask) {
    return stream.writeByte(singleByteBits | value);
  }

  value -= singleByteMask + 1;
  if (value <= 0xff) {
    stream.writeByte(u8marker);
    return stream.writeByte(value);
  }

  value -= 0x100;
  if (value <= 0xffff) {
    stream.writeByte(u16marker);
    return stream.writeUint16(value);
  }

  value -= 0x10000;
  stream.writeByte(u32marker);
  return stream.writeUint32(value);
}

function writeStringIndex(stream, index) {
  return writeSemanticUint(stream, index, 0xa0, 0x1f, 0xd9, 0xda, 0xdb);
}

function writeArrayLength(stream, length) {
  return writeSemanticUint(stream, length, 0x90, 0x0f, 0xc7, 0xdc, 0xdd);
}

function writeSchemaIndex(stream, index) {
  return writeSemanticUint(stream, index, 0x80, 0x0f, 0xc8, 0xde, 0xdf);
}

function concatWriters(...streams) {
  const len = streams.reduce((n, writer) => n + writer.length, 0);
  const result = new Uint8Array(len);

  streams.reduce((offset, writer) => {
    result.set(writer.getUint8View(), offset);
    return offset + writer.length;
  }, 0);

  return result;
}

class CramWriter {
  constructor() {
    this._strings = [];
    this._stringToIndex = {};

    this._schemaKeySets = [];
    this._schemaToIndex = new HashMap(shallowArrayEquals, (m) => m.join('^'));

    this._data = new WriteStream();
    this._data.littleEndian = true;
  }

  writeGraph(value) {
    this._writeValue(value);

    const header = new WriteStream(4);
    header.littleEndian = true;
    header.writeUint32(MAGIC_V1);

    const packedSchemas = this._writeSchemas();
    const stringTable = this._writeStringTable();
    return concatWriters(header, stringTable, packedSchemas, this._data);
  }

  _writeSchemas() {
    const stream = new WriteStream();
    stream.littleEndian = true;
    writeVaryLengthUint(stream, this._schemaKeySets.length);
    for (const keySet of this._schemaKeySets) {
      writeVaryLengthUint(stream, keySet.length);
      for (const key of keySet) {
        writeVaryLengthUint(stream, this._indexForString(key));
      }
    }
    return stream;
  }

  _writeStringTable() {
    const stream = new WriteStream();
    stream.littleEndian = true;
    writeVaryLengthUint(stream, this._strings.length);
    for (const string of this._strings) {
      const bytes = utf8Encode(string);
      writeVaryLengthUint(stream, bytes.length);
      stream.writeBytes(bytes);
    }
    return stream;
  }

  _indexForString(string) {
    if (hasOwn.call(this._stringToIndex, string)) {
      return this._stringToIndex[string];
    }
    const index = (this._stringToIndex[string] = this._strings.length);
    this._strings.push(string);
    return index;
  }

  _indexForKeySet(keys) {
    // precondition: keys must be sorted
    let index = this._schemaToIndex.get(keys, -1);
    if (index === -1) {
      index = this._schemaKeySets.length;
      this._schemaToIndex.set(keys, index);
      this._schemaKeySets.push(keys);
    }
    return index;
  }

  _writeValue(value) {
    switch (value) {
      case null:
        return this._data.writeByte(0xc0);
      case undefined:
        return this._data.writeByte(0xc1);
      case false:
        return this._data.writeByte(0xc2);
      case true:
        return this._data.writeByte(0xc3);
    }

    switch (typeof value) {
      case 'number':
        if (isFinite(value) && value === Math.floor(value)) {
          return writeInteger(this._data, value);
        }
        return writeFloat(this._data, value);
      case 'string':
        return writeStringIndex(this._data, this._indexForString(value));
    }

    if (isArrayLike(value)) {
      return this._writeArray(value);
    }

    return this._writeMapping(value);
  }

  _writeArray(array) {
    const len = array.length;
    writeArrayLength(this._data, len);
    for (let i = 0; i < len; i++) {
      this._writeValue(array[i]);
    }
  }

  _writeMapping(mapping) {
    const keys = Object.keys(mapping);
    const len = keys.length;
    keys.sort();
    const index = this._indexForKeySet(keys);
    writeSchemaIndex(this._data, index);
    for (let i = 0; i < len; i++) {
      this._writeValue(mapping[keys[i]]);
    }
  }
}

export function cram(value) {
  return new CramWriter().writeGraph(value);
}

export function uncram(binaryData) {
  return new CramReader().readGraph(binaryData);
}
