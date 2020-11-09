/**
 * @file abstream: ArrayBuffer streams
 *
 * Synchronous stream-like interfaces for reading and writing byte sequences,
 * integers and floats to and from `ArrayBuffer`s and `TypedArray`s.
 */
import { getPrototypeMethodInfo } from './lib/internal/dataviewmeta';

function isBufferView(a) {
  return (
    a instanceof Int8Array ||
    a instanceof Uint8Array ||
    a instanceof Uint8ClampedArray ||
    a instanceof Int16Array ||
    a instanceof Uint16Array ||
    a instanceof Int32Array ||
    a instanceof Uint32Array ||
    a instanceof Float32Array ||
    a instanceof Float64Array ||
    a instanceof DataView
  );
}

function slowCopy(source, sourceOffset, sourceEnd, target, targetOffset) {
  while (sourceOffset < sourceEnd) {
    target[targetOffset++] = source[sourceOffset++];
  }
}

// the following functions create methods which are eventually assigned to
// prototypes, so the use of `this` is legit here
/* eslint-disable no-invalid-this */
function makeByteReaderMethod(getter) {
  return function () {
    return getter.call(this._data, this.offset++);
  };
}

function makeMultibyteReaderMethod(getter, size) {
  return function () {
    const value = getter.call(this._data, this.offset, this.littleEndian);
    this.offset += size;
    return value;
  };
}
/* eslint-enable no-invalid-this */

function addReadDataViewMethods(prototype) {
  for (const method of getPrototypeMethodInfo()) {
    const methodName = 'read' + method.suffix;
    prototype[methodName] =
      method.size === 1
        ? makeByteReaderMethod(method.getter)
        : makeMultibyteReaderMethod(method.getter, method.size);
  }
}

export class ReadStream {
  constructor(bufferOrTypedArray, byteOffset = 0, byteLength = null) {
    let buffer;

    if (bufferOrTypedArray instanceof ArrayBuffer) {
      buffer = bufferOrTypedArray;
      if (byteLength == null) {
        byteLength = buffer.byteLength;
      }
    } else if (isBufferView(bufferOrTypedArray)) {
      buffer = bufferOrTypedArray.buffer;
      byteOffset += bufferOrTypedArray.byteOffset;
      if (byteLength == null) {
        byteLength = bufferOrTypedArray.byteLength;
      }
    } else {
      throw new Error(
        'Stream backing object must be ArrayBuffer or TypedArray'
      );
    }

    this._buffer = buffer;
    this._bytes = new Uint8Array(buffer, byteOffset, byteLength);
    this._data = new DataView(buffer, byteOffset, byteLength);
    this.offset = 0;
    this.littleEndian = false;
  }

  readByte() {
    return this._bytes[this.offset++];
  }

  /*
   * Set byteCount to < 0 to read to end of buffer
   */
  readBytes(byteCount = -1, target = null, targetOffset = 0) {
    const bytes = this._bytes;
    const end = this._endOffset(byteCount);

    if (target) {
      if (typeof target.set === 'function') {
        target.set(bytes.subarray(this.offset, end), targetOffset);
      } else {
        slowCopy(bytes, this.offset, end, target, targetOffset);
      }
    }

    const bytesRead = end - this.offset;
    this.offset = end;
    return bytesRead;
  }

  readBytesTo(sentinel, maxByteCount = -1, target = null, targetOffset = 0) {
    const bytes = this._bytes;
    const end = this._endOffset(maxByteCount);

    let search = this.offset;

    while (search < end) {
      // the ++ must be done here, because we want to include the sentinel in
      // the copy to target
      if (bytes[search++] === sentinel) {
        break;
      }
    }

    return this.readBytes(search - this.offset, target, targetOffset);
  }

  readData(dataType) {
    // dataType must have a method .unpack(dataView, offset, littleEndian)
    // and a property .size
    const value = dataType.unpack(this._data, this.offset, this.littleEndian);
    this.offset += dataType.size;
    return value;
  }

  eof() {
    return this.offset >= this._bytes.length;
  }

  _endOffset(byteCount) {
    const maxOffset = this._bytes.length;
    if (byteCount >= 0) {
      return Math.min(maxOffset, this.offset + byteCount);
    }
    return maxOffset;
  }
}
addReadDataViewMethods(ReadStream.prototype);

/* eslint-disable no-invalid-this */
function makeByteWriterMethod(setter) {
  return function (value) {
    const offset = this.offset;
    this._advance(1);
    setter.call(this._data, offset, value);
  };
}

function makeMultibyteWriterMethod(setter, size) {
  return function (value) {
    const offset = this.offset;
    this._advance(size);
    setter.call(this._data, offset, value, this.littleEndian);
  };
}
/* eslint-enable no-invalid-this */

function addWriteDataViewMethods(prototype) {
  for (const method of getPrototypeMethodInfo()) {
    prototype['write' + method.suffix] =
      method.size === 1
        ? makeByteWriterMethod(method.setter)
        : makeMultibyteWriterMethod(method.setter, method.size);
  }
}

// JS max floating point having integer precision. this is over 8000 TB
const ABSOLUTE_MAX_SIZE = 9007199254740992;

const DEFAULT_MAX_SIZE = 0x20000000; // 512 MB, i guess
const DEFAULT_INITIAL_SIZE = 0x8000; // 32 KB, i suppose

export class WriteStream {
  constructor(initialSize, maxSize = 0) {
    if (!isFinite(initialSize) || initialSize <= 0) {
      initialSize = DEFAULT_INITIAL_SIZE;
    }

    if (maxSize > 0) {
      maxSize = Math.min(maxSize, ABSOLUTE_MAX_SIZE);
    } else {
      maxSize = DEFAULT_MAX_SIZE;
    }

    this._maxSize = maxSize;

    this._bytes = new Uint8Array(initialSize);
    this._data = new DataView(this._bytes.buffer);

    this.length = 0;
    this.offset = 0;
    this.littleEndian = false;
  }

  writeByte(value) {
    const offset = this.offset;
    this._advance(1);
    this._bytes[offset] = value;
  }

  writeBytes(source) {
    const offset = this.offset;
    this._advance(source.length);
    this._bytes.set(source, offset);
  }

  writeData(dataType, value) {
    const offset = this.offset;
    this._advance(dataType.size);
    dataType.pack(this._data, offset, value, this.littleEndian);
  }

  copyBuffer() {
    return this._bytes.buffer.slice(0, this.length);
  }

  getUint8View() {
    return new Uint8Array(this._bytes.buffer, 0, this.length);
  }

  _advance(byteCount) {
    this.offset += byteCount;
    this.allocate(this.offset);
    if (this.offset > this.length) {
      this.length = this.offset;
    }
  }

  allocate(minimumOffset) {
    let size = this._bytes.length;

    if (minimumOffset < size) {
      return;
    }

    if (size >= this._maxSize) {
      throw new Error(`Reached maximum size of ${this._maxSize}`);
    }

    size = Math.pow(2, Math.floor(Math.log(size) * Math.LOG2E) + 1);

    if (size < DEFAULT_INITIAL_SIZE) {
      size = DEFAULT_INITIAL_SIZE;
    } else if (size > this._maxSize) {
      size = this._maxSize;
    }

    this._resize(size);
  }

  _resize(size) {
    const newBytes = new Uint8Array(size);
    newBytes.set(this._bytes, 0);
    this._bytes = newBytes;
    this._data = new DataView(this._bytes.buffer);
  }
}
addWriteDataViewMethods(WriteStream.prototype);
