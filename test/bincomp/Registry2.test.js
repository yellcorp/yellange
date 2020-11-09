import { assert } from 'chai';

import { Registry, Struct, Union } from '../../bincomp';

describe('bincomp#Registry (2)', () => {
  it('creates a child Struct through a chainable method', () => {
    const registry = new Registry().struct('StructTest', [['uint16', 'short']]);

    assert.instanceOf(registry, Registry);
    assert.isTrue(registry.has('StructTest'));
    assert.isTrue(registry.hasOwn('StructTest'));

    const struct = registry.get('StructTest');
    assert.instanceOf(struct, Struct);
    assert.strictEqual(struct.name, 'StructTest');
    assert.strictEqual(struct.size, 2);
  });

  it('creates a child Union through a chainable method', () => {
    const registry = new Registry().union('UnionTest', [['uint16', 'short']]);

    assert.instanceOf(registry, Registry);
    assert.isTrue(registry.has('UnionTest'));
    assert.isTrue(registry.hasOwn('UnionTest'));

    const union = registry.get('UnionTest');
    assert.instanceOf(union, Union);
    assert.strictEqual(union.name, 'UnionTest');
    assert.strictEqual(union.size, 2);
  });

  it('rejects name clashes within a single registry', () => {
    const registry = new Registry();

    registry.struct('DupeName', [['uint16', 'short']]);

    assert.throws(() => {
      registry.struct('DupeName', [['uint8', 'somethingElse']]);
    });
  });

  it('creates child registries', () => {
    const parent = new Registry();
    assert.instanceOf(parent, Registry);

    const child = parent.newChild();
    assert.instanceOf(child, Registry);

    parent.struct('ParentStruct', [['uint16', 'parentShort']]);
    child.struct('ChildStruct', [['uint16', 'childShort']]);

    assert.isTrue(parent.has('ParentStruct'));
    assert.isTrue(parent.hasOwn('ParentStruct'));
    assert.isFalse(parent.has('ChildStruct'));

    assert.isTrue(child.has('ParentStruct'));
    assert.isFalse(child.hasOwn('ParentStruct'));
    assert.isTrue(child.has('ChildStruct'));
    assert.isTrue(child.hasOwn('ChildStruct'));
  });

  it('creates types that refer to other registered types', () => {
    const reg = new Registry();

    // let's imagine a simple union data type
    reg.union('Number', [
      ['uint32', 'word'],
      ['float32', 'float'],
    ]);

    // and a struct that identifies what type was stored
    reg.struct('TypedNumber', [
      ['uint8', 'type'],
      ['Number', 'data'],
    ]);
    assert.strictEqual(reg.get('TypedNumber').size, 5);

    // and let's say something you might find in a directory of tags
    reg.struct('DirEntry', [
      ['char', 'fourcc[4]'],
      ['uint32', 'offset'],
      ['uint32', 'length'],
    ]);
    assert.strictEqual(reg.get('DirEntry').size, 12);

    // and... i dunno. make up something that refers to them
    reg.struct('Header', [
      ['TypedNumber', 'time'],
      ['DirEntry', 'entries[3]'],
    ]);
    assert.strictEqual(reg.get('Header').size, 41);

    const byteArray = new Uint8Array(reg.get('Header').size);
    reg.get('Header').pack(
      new DataView(byteArray.buffer),
      0,
      {
        time: {
          type: 254,
          data: { word: 0x01020304 },
        },
        entries: [
          {
            fourcc: 'ABCD',
            offset: 0x02030405,
            length: 0x06070809,
          },
          {
            fourcc: 'EFGH',
            offset: 0x0a0b0c0d,
            length: 0x0e0f1011,
          },
          {
            fourcc: 'IJKL',
            offset: 0x12131415,
            length: 0x16171819,
          },
        ],
      },
      true
    );

    // prettier-ignore
    const expect = new Uint8Array([
      0xFE,
      0x04, 0x03, 0x02, 0x01,

      0x41, 0x42, 0x43, 0x44,
      0x05, 0x04, 0x03, 0x02,
      0x09, 0x08, 0x07, 0x06,

      0x45, 0x46, 0x47, 0x48,
      0x0D, 0x0C, 0x0B, 0x0A,
      0x11, 0x10, 0x0F, 0x0E,

      0x49, 0x4A, 0x4B, 0x4C,
      0x15, 0x14, 0x13, 0x12,
      0x19, 0x18, 0x17, 0x16
    ]);

    assert.deepEqual(byteArray, expect);

    // try unpacking - but first, because we're unpacking a union, we need to
    // know how the bytes of our test integer is interpreted as a float
    const aliaser = new DataView(new ArrayBuffer(4));
    aliaser.setUint32(0, 0x01020304, true);
    const expectFloat = aliaser.getFloat32(0, true);

    const graph = reg
      .get('Header')
      .unpack(new DataView(expect.buffer), 0, true);

    assert.deepEqual(graph, {
      time: {
        type: 254,
        data: {
          word: 0x01020304,
          float: expectFloat,
        },
      },
      entries: [
        {
          fourcc: 'ABCD',
          offset: 0x02030405,
          length: 0x06070809,
        },
        {
          fourcc: 'EFGH',
          offset: 0x0a0b0c0d,
          length: 0x0e0f1011,
        },
        {
          fourcc: 'IJKL',
          offset: 0x12131415,
          length: 0x16171819,
        },
      ],
    });
  });
});
