import { assert } from 'chai';

import { Union } from '../../bincomp';

function dataViewOfBytes(bytes) {
  const byteArray = new Uint8Array(bytes);
  return new DataView(byteArray.buffer);
}

describe('bincomp#Union', () => {
  function makeUnion() {
    return new Union('UnionTest', [
      ['uint8', 'bytes[8]'],
      ['char', 'strings[2][4]'],
      ['uint16', 'shorts[4]'],
      ['uint32', 'words[2]'],
    ]);
  }

  it('sets the name property', () => {
    const union = makeUnion();
    assert.strictEqual(union.name, 'UnionTest');
  });

  it('has the correct size', () => {
    const union = makeUnion();
    assert.strictEqual(union.size, 8);
  });

  it('unpacks correctly in big-endian mode', () => {
    const union = makeUnion();
    const dataView = dataViewOfBytes([
      0x40,
      0x41,
      0x42,
      0x43,
      0x44,
      0x45,
      0x46,
      0x47,
    ]);
    const obj = union.unpack(dataView, 0, false);

    assert.deepEqual(obj, {
      bytes: [0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47],
      strings: ['@ABC', 'DEFG'],
      shorts: [0x4041, 0x4243, 0x4445, 0x4647],
      words: [0x40414243, 0x44454647],
    });
  });

  // TODO: pack tests are copy-pastey
  it('packs correctly in big-endian mode (1)', () => {
    const union = makeUnion();
    const got = new Uint8Array(union.size);
    const dataView = new DataView(got.buffer);

    const field = { strings: ['@ABC', 'DEFG'] };

    union.pack(dataView, 0, field, false);

    assert.deepEqual(
      got,
      new Uint8Array([0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47])
    );
  });

  it('packs correctly in big-endian mode (2)', () => {
    const union = makeUnion();
    const got = new Uint8Array(union.size);
    const dataView = new DataView(got.buffer);

    const field = { shorts: [0x4041, 0x4243, 0x4445, 0x4647] };

    union.pack(dataView, 0, field, false);

    assert.deepEqual(
      got,
      new Uint8Array([0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47])
    );
  });

  it('unpacks correctly in little-endian mode', () => {
    const union = makeUnion();
    const dataView = dataViewOfBytes([
      0x60,
      0x61,
      0x62,
      0x63,
      0x64,
      0x65,
      0x66,
      0x67,
    ]);
    const obj = union.unpack(dataView, 0, true);

    assert.deepEqual(obj, {
      bytes: [0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67],
      strings: ['`abc', 'defg'],
      shorts: [0x6160, 0x6362, 0x6564, 0x6766],
      words: [0x63626160, 0x67666564],
    });
  });

  it('packs correctly in little-endian mode (1)', () => {
    const union = makeUnion();
    const got = new Uint8Array(union.size);
    const dataView = new DataView(got.buffer);

    const field = { strings: ['@ABC', 'DEFG'] };

    union.pack(dataView, 0, field, true);

    assert.deepEqual(
      got,
      new Uint8Array([0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47])
    );
  });

  it('packs correctly in little-endian mode (2)', () => {
    const union = makeUnion();
    const got = new Uint8Array(union.size);
    const dataView = new DataView(got.buffer);

    const field = { shorts: [0x4140, 0x4342, 0x4544, 0x4746] };

    union.pack(dataView, 0, field, true);

    assert.deepEqual(
      got,
      new Uint8Array([0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47])
    );
  });
});
