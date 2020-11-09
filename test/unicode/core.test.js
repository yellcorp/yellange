import { assert } from 'chai';

import * as core from '../../unicode/core';

describe('unicode#core', () => {
  describe('MAX_CODEPOINT', () => {
    it('has the correct value', () => {
      assert.strictEqual(core.MAX_CODEPOINT, 0x10ffff);
    });
  });

  describe('MAX_BMP_CODEPOINT', () => {
    it('has the correct value', () => {
      assert.strictEqual(core.MAX_BMP_CODEPOINT, 0xffff);
    });
  });

  describe('REPLACEMENT_CHARACTER_CODEPOINT', () => {
    it('has the correct value', () => {
      assert.strictEqual(core.REPLACEMENT_CHARACTER_CODEPOINT, 0xfffd);
    });
  });

  describe('REPLACEMENT_CHARACTER', () => {
    it('has the correct value', () => {
      assert.strictEqual(core.REPLACEMENT_CHARACTER, '\uFFFD');
    });
  });

  describe('MIN_LEAD_SURROGATE', () => {
    it('has the correct value', () => {
      assert.strictEqual(core.MIN_LEAD_SURROGATE, 0xd800);
    });
  });

  describe('MAX_LEAD_SURROGATE', () => {
    it('has the correct value', () => {
      assert.strictEqual(core.MAX_LEAD_SURROGATE, 0xdbff);
    });
  });

  describe('isLeadSurrogate', () => {
    it('correctly detects the lowest lead surrogate', () => {
      assert.isTrue(core.isLeadSurrogate(0xd800));
    });

    it('correctly rejects lowest lead surrogate - 1', () => {
      assert.isFalse(core.isLeadSurrogate(0xd7ff));
    });

    it('correctly detects the highest lead surrogate', () => {
      assert.isTrue(core.isLeadSurrogate(0xdbff));
    });

    it('correctly rejects the lowest trail surrogate', () => {
      assert.isFalse(core.isLeadSurrogate(0xdc00));
    });

    it('correctly rejects the highest trail surrogate', () => {
      assert.isFalse(core.isLeadSurrogate(0xdfff));
    });

    it('correctly rejects out of range values', () => {
      assert.isFalse(core.isLeadSurrogate(-1));
      assert.isFalse(core.isLeadSurrogate(0x110000));
    });
  });

  describe('MIN_TRAIL_SURROGATE', () => {
    it('has the correct value', () => {
      assert.strictEqual(core.MIN_TRAIL_SURROGATE, 0xdc00);
    });
  });

  describe('MAX_TRAIL_SURROGATE', () => {
    it('has the correct value', () => {
      assert.strictEqual(core.MAX_TRAIL_SURROGATE, 0xdfff);
    });
  });

  describe('isTrailSurrogate', () => {
    it('correctly rejects the highest lead surrogate', () => {
      assert.isFalse(core.isTrailSurrogate(0xdbff));
    });

    it('correctly detects the lowest trail surrogate', () => {
      assert.isTrue(core.isTrailSurrogate(0xdc00));
    });

    it('correctly detects the highest trail surrogate', () => {
      assert.isTrue(core.isTrailSurrogate(0xdfff));
    });

    it('correctly rejects the highest trail surrogate + 1', () => {
      assert.isFalse(core.isTrailSurrogate(0xe000));
    });

    it('correctly rejects out of range values', () => {
      assert.isFalse(core.isTrailSurrogate(-1));
      assert.isFalse(core.isTrailSurrogate(0x110000));
    });
  });

  describe('MIN_SURROGATE', () => {
    it('has the correct value', () => {
      assert.strictEqual(core.MIN_SURROGATE, 0xd800);
    });
  });

  describe('MAX_SURROGATE', () => {
    it('has the correct value', () => {
      assert.strictEqual(core.MAX_SURROGATE, 0xdfff);
    });
  });

  describe('isSurrogate', () => {
    it('correctly detects the lowest lead surrogate', () => {
      assert.isTrue(core.isSurrogate(0xd800));
    });

    it('correctly detects the highest lead surrogate', () => {
      assert.isTrue(core.isSurrogate(0xdbff));
    });

    it('correctly detects the lowest trail surrogate', () => {
      assert.isTrue(core.isSurrogate(0xdc00));
    });

    it('correctly detects the highest trail surrogate', () => {
      assert.isTrue(core.isSurrogate(0xdfff));
    });

    it('correctly rejects the lowest lead surrogate - 1', () => {
      assert.isFalse(core.isSurrogate(0xd7ff));
    });

    it('correctly rejects the highest trail surrogate + 1', () => {
      assert.isFalse(core.isSurrogate(0xe000));
    });

    it('correctly rejects out of range values', () => {
      assert.isFalse(core.isSurrogate(-1));
      assert.isFalse(core.isSurrogate(0x110000));
    });
  });

  describe('decodeSurrogatePair', () => {
    it('correctly decodes surrogate pairs', () => {
      assert.strictEqual(core.decodeSurrogatePair(0xd800, 0xdc00), 0x10000);
      assert.strictEqual(core.decodeSurrogatePair(0xdbff, 0xdfff), 0x10ffff);
      assert.strictEqual(core.decodeSurrogatePair(0xdaaa, 0xdd55), 0xba955);
    });

    it('correctly rejects invalid pairs', () => {
      // trail - lead
      assert.isBelow(core.decodeSurrogatePair(0xdc00, 0xd800), 0);

      // trail - trail
      assert.isBelow(core.decodeSurrogatePair(0xdc00, 0xdfff), 0);

      // lead - lead
      assert.isBelow(core.decodeSurrogatePair(0xd800, 0xdbff), 0);

      // lead - non
      assert.isBelow(core.decodeSurrogatePair(0xd800, 0xd7ff), 0);

      // non - trail
      assert.isBelow(core.decodeSurrogatePair(0xe000, 0xdfff), 0);

      // non - non
      assert.isBelow(core.decodeSurrogatePair(0xd7ff, 0xe000), 0);
    });
  });

  describe('decodeSurrogatePairString', () => {
    it('correctly decodes surrogate pairs', () => {
      assert.strictEqual(
        core.decodeSurrogatePairString('\uD800\uDC00'),
        0x10000
      );

      assert.strictEqual(
        core.decodeSurrogatePairString('\uDBFF\uDFFF'),
        0x10ffff
      );

      assert.strictEqual(
        core.decodeSurrogatePairString('\uDAAA\uDD55'),
        0xba955
      );
    });

    it('correctly rejects invalid pairs', () => {
      // trail - lead
      assert.isBelow(core.decodeSurrogatePairString('\uDC00\uD800'), 0);

      // trail - trail
      assert.isBelow(core.decodeSurrogatePairString('\uDC00\uDFFF'), 0);

      // lead - lead
      assert.isBelow(core.decodeSurrogatePairString('\uD800\uDBFF'), 0);

      // lead - non
      assert.isBelow(core.decodeSurrogatePairString('\uD800\uD7FF'), 0);

      // non - trail
      assert.isBelow(core.decodeSurrogatePairString('\uE000\uDFFF'), 0);

      // non - non
      assert.isBelow(core.decodeSurrogatePairString('\uD7FF\uE000'), 0);
    });
  });
});

describe('unicode#core#leadSurrogateForCodepoint', () => {
  it('returns the correct value', () => {
    assert.strictEqual(core.leadSurrogateForCodepoint(0x10000), 0xd800);
    assert.strictEqual(core.leadSurrogateForCodepoint(0x10ffff), 0xdbff);
    assert.strictEqual(core.leadSurrogateForCodepoint(0xba955), 0xdaaa);
  });
});

describe('unicode#core#trailSurrogateForCodepoint', () => {
  it('returns the correct value', () => {
    assert.strictEqual(core.trailSurrogateForCodepoint(0x10000), 0xdc00);
    assert.strictEqual(core.trailSurrogateForCodepoint(0x10ffff), 0xdfff);
    assert.strictEqual(core.trailSurrogateForCodepoint(0xba955), 0xdd55);
  });
});

describe('unicode#core#codepointToUTF16', () => {
  it('correctly encodes codepoints', () => {
    assert.deepEqual(core.codepointToUTF16(0x10000), [0xd800, 0xdc00]);
    assert.deepEqual(core.codepointToUTF16(0x10ffff), [0xdbff, 0xdfff]);
    assert.deepEqual(core.codepointToUTF16(0xba955), [0xdaaa, 0xdd55]);
    assert.deepEqual(core.codepointToUTF16(0), [0]);
    assert.deepEqual(core.codepointToUTF16(0xffff), [0xffff]);
  });
});

describe('unicode#core#codepointToString', () => {
  it('correctly encodes codepoints', () => {
    assert.strictEqual(core.codepointToString(0x10000), '\uD800\uDC00');
    assert.strictEqual(core.codepointToString(0x10ffff), '\uDBFF\uDFFF');
    assert.strictEqual(core.codepointToString(0xba955), '\uDAAA\uDD55');
    assert.strictEqual(core.codepointToString(0), '\x00');
    assert.strictEqual(core.codepointToString(0xffff), '\uFFFF');
  });
});

describe('unicode#core#codepointOf', () => {
  it('correctly decodes UTF-16 encoded characters', () => {
    assert.strictEqual(core.codepointOf('\uD800\uDC00'), 0x10000);
    assert.strictEqual(core.codepointOf('\uDBFF\uDFFF'), 0x10ffff);
    assert.strictEqual(core.codepointOf('\uDAAA\uDD55'), 0xba955);
    assert.strictEqual(core.codepointOf('\x00'), 0);
    assert.strictEqual(core.codepointOf('A'), 0x41);
    assert.strictEqual(core.codepointOf('\uFFFF'), 0xffff);
  });
});
