import { assert } from 'chai';

import { Struct } from '../../bincomp';

function testStructInstanceEndian(create, index, object, bytes, isLE) {
  const order = isLE ? 'little' : 'big';
  it(`unpacks instance #${index}, ${order} endian`, () => {
    const comp = create();
    const byteArray = new Uint8Array(bytes());
    const dataView = new DataView(byteArray.buffer);

    const got = comp.unpack(dataView, 0, isLE);
    const expect = object();
    assert.deepEqual(got, expect);
  });

  it(`packs instance #${index}, ${order} endian`, () => {
    const comp = create();
    const got = new Uint8Array(comp.size);
    const dataView = new DataView(got.buffer);

    comp.pack(dataView, 0, object(), isLE);
    const expect = new Uint8Array(bytes());
    assert.deepEqual(got, expect);
  });
}

function testStructInstance(create, index, { object, bytesBE, bytesLE }) {
  testStructInstanceEndian(create, index, object, bytesBE, false);
  testStructInstanceEndian(create, index, object, bytesLE, true);
}

function runStructTest({ testName, create, size, instances }) {
  describe(testName, () => {
    it('creates with the correct size', () => {
      const comp = create();
      assert.strictEqual(comp.size, size);
    });

    for (let i = 0; i < instances.length; i++) {
      testStructInstance(create, i, instances[i]);
    }
  });
}

const structTests = [
  {
    testName: 'Scalar primitives',

    create: () =>
      new Struct('PrimitiveTest', [
        ['uint8', 'a'],
        ['uint16', 'b'],
        ['uint32', 'c'],
      ]),

    size: 7,

    instances: [
      {
        object: () => ({
          a: 1,
          b: 0x0203,
          c: 0x04050607,
        }),

        bytesBE: () => [1, 2, 3, 4, 5, 6, 7],
        bytesLE: () => [1, 3, 2, 7, 6, 5, 4],
      },
    ],
  },

  {
    testName: 'Array primitives',

    create: () =>
      new Struct('ArrayTest', [
        ['uint16', 'a[5]'],
        ['uint8', 'b[3]'],
        ['uint32', 'c[2]'],
        ['uint32', 'd[1]'],
      ]),

    size: 25,

    instances: [
      {
        object: () => ({
          a: [0x0102, 0x0304, 0x0506, 0x0708, 0x090a],
          b: [0x0b, 0x0c, 0x0d],
          c: [0x0e0f1011, 0x12131415],
          d: [0x16171819],
        }),

        // prettier-ignore
        bytesBE: () => [
          0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a,
          0x0b, 0x0c, 0x0d,
          0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15,
          0x16, 0x17, 0x18, 0x19,
        ],

        // prettier-ignore
        bytesLE: () => [
          0x02, 0x01, 0x04, 0x03, 0x06, 0x05, 0x08, 0x07, 0x0a, 0x09,
          0x0b, 0x0c, 0x0d,
          0x11, 0x10, 0x0f, 0x0e, 0x15, 0x14, 0x13, 0x12,
          0x19, 0x18, 0x17, 0x16,
        ],
      },
    ],
  },

  {
    testName: 'Multidimensional array primitives',

    create: () =>
      new Struct('MultidimTest', [
        ['uint16', 'md[4][2]'],
        ['uint8', 'sentinel'],
      ]),

    size: 17,

    instances: [
      {
        object: () => ({
          md: [
            [0x0001, 0x0203],
            [0x0405, 0x0607],
            [0x0809, 0x0a0b],
            [0x0c0d, 0x0e0f],
          ],
          sentinel: 255,
        }),

        // prettier-ignore
        bytesBE: () => [
          0x00, 0x01, 0x02, 0x03,
          0x04, 0x05, 0x06, 0x07,
          0x08, 0x09, 0x0a, 0x0b,
          0x0c, 0x0d, 0x0e, 0x0f,
          0xff,
        ],

        // prettier-ignore
        bytesLE: () => [
          0x01, 0x00, 0x03, 0x02,
          0x05, 0x04, 0x07, 0x06,
          0x09, 0x08, 0x0b, 0x0a,
          0x0d, 0x0c, 0x0f, 0x0e,
          0xff,
        ],
      },
    ],
  },

  {
    testName: "Special case of 'char' as String",

    create: () =>
      new Struct('CharTest', [
        ['uint8', 'sentinel1'],
        ['char', 'someString[8]'],
        ['uint8', 'sentinel2'],
      ]),

    size: 10,

    instances: [
      {
        object: () => ({
          sentinel1: 0x01,
          someString: '@ABCDEFG',
          sentinel2: 0xf1,
        }),

        // prettier-ignore
        bytesBE: () => [
          0x01,
          0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47,
          0xf1,
        ],

        // prettier-ignore
        bytesLE: () => [
          0x01,
          0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47,
          0xf1,
        ],
      },

      {
        object: () => ({
          sentinel1: 0x02,
          someString: '@ABCDE',
          sentinel2: 0xf2,
        }),

        // prettier-ignore
        bytesBE: () => [
          0x02,
          0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0, 0,
          0xf2
        ],

        // prettier-ignore
        bytesLE: () => [
          0x02,
          0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0, 0,
          0xf2
        ],
      },

      {
        object: () => ({
          sentinel1: 0x03,
          someString: '@ABCテ',
          sentinel2: 0xf3,
        }),

        // prettier-ignore
        bytesBE: () => [
          0x03,
          0x40, 0x41, 0x42, 0x43, 0xe3, 0x83, 0x86, 0,
          0xf3,
        ],

        // prettier-ignore
        bytesLE: () => [
          0x03,
          0x40, 0x41, 0x42, 0x43, 0xe3, 0x83, 0x86, 0,
          0xf3,
        ],
      },
    ],
  },

  {
    testName: 'Arrays of strings',

    create: () =>
      new Struct('CharTest', [
        ['uint8', 'sentinel1'],
        ['char', 'oneDeep[2][4]'],
        ['char', 'twoDeep[2][2][4]'],
        ['uint8', 'sentinel2'],
      ]),

    size: 26,

    instances: [
      {
        object: () => ({
          sentinel1: 0x08,
          oneDeep: ['bool', 'char'],
          twoDeep: [
            ['enum', 'true'],
            ['this', 'case'],
          ],
          sentinel2: 0xf8,
        }),

        // prettier-ignore
        bytesBE: () => [
          0x08,
          0x62, 0x6f, 0x6f, 0x6c, 0x63, 0x68, 0x61, 0x72,
          0x65, 0x6e, 0x75, 0x6d, 0x74, 0x72, 0x75, 0x65,
          0x74, 0x68, 0x69, 0x73, 0x63, 0x61, 0x73, 0x65,
          0xf8,
        ],

        // prettier-ignore
        bytesLE: () => [
          0x08,
          0x62, 0x6f, 0x6f, 0x6c, 0x63, 0x68, 0x61, 0x72,
          0x65, 0x6e, 0x75, 0x6d, 0x74, 0x72, 0x75, 0x65,
          0x74, 0x68, 0x69, 0x73, 0x63, 0x61, 0x73, 0x65,
          0xf8,
        ],
      },
    ],
  },
];

describe('bincomp#Struct', () => {
  it('sets the name property', () => {
    const struct = new Struct('NameTest', [['uint8', 'a']]);

    assert.strictEqual(struct.name, 'NameTest');
  });

  for (const test of structTests) {
    runStructTest(test);
  }
});
