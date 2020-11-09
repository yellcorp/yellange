import { assert } from 'chai';

import { Registry } from '../../bincomp';

function makeTypeExistenceTest(name, size) {
  return () => {
    const registry = new Registry();
    const type = registry.get(name);
    assert.strictEqual(type.name, name);
    assert.strictEqual(type.size, size);
  };
}

function initUint8Array(size) {
  const bytes = new Uint8Array(size);
  const pattern = [0xca, 0xfe, 0xbe, 0xef];

  for (let i = 0; i < size; i++) {
    bytes[i] = pattern[i % pattern.length];
  }

  return bytes;
}

function setupReadWriteTest(registry, name, beBytes, isLE) {
  if (!registry) {
    registry = new Registry();
  }

  const type = registry.get(name);
  const size = beBytes.length;

  const bytes = beBytes.slice();
  if (isLE) {
    bytes.reverse();
  }

  const byteArray = initUint8Array((size + 1) * 2);
  byteArray.set(bytes, 0);
  byteArray.set(bytes, size + 1);

  return [type, byteArray];
}

function makeTypeReadTest(name, beBytes, value, isLE) {
  return () => {
    const [type, byteArray] = setupReadWriteTest(null, name, beBytes, isLE);

    const size = beBytes.length;
    const dataView = new DataView(byteArray.buffer);

    assert.strictEqual(type.unpack(dataView, 0, isLE), value);

    assert.strictEqual(type.unpack(dataView, size + 1, isLE), value);
  };
}

function makeTypeWriteTest(name, beBytes, value, isLE) {
  return () => {
    const [type, byteArray] = setupReadWriteTest(null, name, beBytes, isLE);

    const size = beBytes.length;
    const writeArray = initUint8Array(byteArray.length);
    const dataView = new DataView(writeArray.buffer);

    type.pack(dataView, 0, value, isLE);
    type.pack(dataView, size + 1, value, isLE);

    assert.deepEqual(writeArray, byteArray);
  };
}

describe('bincomp#Registry (1)', () => {
  const tests = [
    ['int8', [0xcc], -52],
    ['uint8', [0xcc], 204],
    ['int16', [0x99, 0x66], -26266],
    ['uint16', [0xf0, 0x0f], 61455],
    ['int32', [0xf8, 0x3e, 0x0f, 0x83], -130150525],
    ['uint32', [0xe0, 0xf8, 0x3e, 0x0f], 3774365199],
  ];

  for (const [name, beBytes, value] of tests) {
    it(
      `by default, has a type called ${name}`,
      makeTypeExistenceTest(name, beBytes.length)
    );

    it(
      `can read the type ${name} big-endian`,
      makeTypeReadTest(name, beBytes, value, false)
    );

    it(
      `can read the type ${name} little-endian`,
      makeTypeReadTest(name, beBytes, value, true)
    );

    it(
      `can write the type ${name} big-endian`,
      makeTypeWriteTest(name, beBytes, value, false)
    );

    it(
      `can write the type ${name} little-endian`,
      makeTypeWriteTest(name, beBytes, value, true)
    );
  }
});
