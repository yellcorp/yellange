import { assert } from 'chai';

import * as codec from '../../unicode/codec';

// U+1F40A Crocodile 🐊
const CROC = '\ud83d\udc0a';

const REPLACEMENT_RUN = new RegExp('\uFFFD+', 'g');
function collapseReplacementRuns(string) {
  // At the moment we just check that decoders emit iat least one U+FFFD for
  // invalid encoded sequences, but exactly how many is left unspecified.  So
  // we store the expected value with a single U+FFFD where a run of one or
  // more of them are expected to occur, and we transform the got value,
  // replacing each run of them with a single one.
  return string.replace(REPLACEMENT_RUN, '\uFFFD');
}

describe('~collapseReplacementRuns', () => {
  it('accepts empty strings', () => {
    assert.strictEqual(collapseReplacementRuns(''), '');
  });

  it('passes through replacement-less strings', () => {
    assert.strictEqual(collapseReplacementRuns('abc'), 'abc');
  });

  it('passes through single replacements', () => {
    assert.strictEqual(collapseReplacementRuns('\uFFFD'), '\uFFFD');
    assert.strictEqual(collapseReplacementRuns('a\uFFFD'), 'a\uFFFD');
    assert.strictEqual(collapseReplacementRuns('\uFFFDb'), '\uFFFDb');
    assert.strictEqual(collapseReplacementRuns('a\uFFFDb'), 'a\uFFFDb');
    assert.strictEqual(
      collapseReplacementRuns('a\uFFFDb\uFFFDc'),
      'a\uFFFDb\uFFFDc'
    );
  });

  it('collapses runs of replacements', () => {
    assert.strictEqual(collapseReplacementRuns('\uFFFD\uFFFD'), '\uFFFD');
    assert.strictEqual(collapseReplacementRuns('a\uFFFD\uFFFD'), 'a\uFFFD');
    assert.strictEqual(collapseReplacementRuns('\uFFFD\uFFFDb'), '\uFFFDb');
    assert.strictEqual(collapseReplacementRuns('a\uFFFD\uFFFDb'), 'a\uFFFDb');
    assert.strictEqual(
      collapseReplacementRuns('a\uFFFD\uFFFDb\uFFFD\uFFFDc'),
      'a\uFFFDb\uFFFDc'
    );
    assert.strictEqual(
      collapseReplacementRuns('a\uFFFD\uFFFDb\uFFFD\uFFFDc\uFFFDd'),
      'a\uFFFDb\uFFFDc\uFFFDd'
    );
  });
});

const UTF8_TESTS = [
  // empty
  ['', []],

  // 1-byte
  ['\x00', [0x00]], // lowest
  ['A', [0x41]], // typical
  ['\x7F', [0x7f]], // highest

  // 2-byte
  ['\x80', [0xc2, 0x80]], // lowest
  ['é', [0xc3, 0xa9]], // typical
  ['ε', [0xce, 0xb5]], // typical not iso 8859-1, but still 2-byte
  ['\u07FF', [0xdf, 0xbf]], // highest

  // 3-byte
  ['\u0800', [0xe0, 0xa0, 0x80]], // lowest
  ['テ', [0xe3, 0x83, 0x86]], // typical
  ['\uFFFF', [0xef, 0xbf, 0xbf]], // highest

  // 4-byte
  ['\ud800\udc00', [0xf0, 0x90, 0x80, 0x80]], // lowest
  [CROC, [0xf0, 0x9f, 0x90, 0x8a]], // typical emoji
  ['\ud83c\udd63', [0xf0, 0x9f, 0x85, 0xa3]], // typical non-emoji 🅣  U+1F163: NEGATIVE CIRCLED LATIN CAPITAL LETTER T
  ['\ud840\udc16', [0xf0, 0xa0, 0x80, 0x96]], // plane 2 hanzi 𠀖
  ['\udbff\udfff', [0xf4, 0x8f, 0xbf, 0xbf]], // highest
];

const UTF8_REJECTS = [
  // the lowest out-of-range 4-byte sequence. this would decode to
  // 0x00110000 - i.e. MAX_CODEPOINT + 1
  ['\uFFFD', [0xf4, 0x90, 0x80, 0x80]],

  // the highest out-of-range 4-byte sequence. this would decode to
  // 0x001FFFFF
  ['\uFFFD', [0xf7, 0xbf, 0xbf, 0xbf]],

  // an extrapolation of utf8 to 5-byte sequences. this would be supported
  // by old decoders, or perhaps highly algorithmic decoders that don't have an
  // upper limit on sequence lengths
  ['\uFFFD', [0xf9, 0x82, 0x83, 0x84, 0x85]],

  // a would-be 6-byte sequence
  ['\uFFFD', [0xfd, 0x82, 0x83, 0x84, 0x85, 0x86]],

  // not allowed anywhere
  ['\uFFFD', [0xfe]],
  ['\uFFFD', [0xff]],
  ['\uFFFD', [0xfe, 0xfe, 0xff, 0xff]],

  // lowest bare continuation byte
  ['\uFFFD', [0x80]],

  // highest bare continuation byte
  ['\uFFFD', [0xbf]],

  // sequences of multiple bare continuation bytes
  ['\uFFFD', [0x80, 0x81]],
  ['\uFFFD', [0x80, 0x81, 0x82]],
  ['\uFFFD', [0x80, 0x81, 0x82, 0x83]],
  ['\uFFFD', [0x80, 0x81, 0x82, 0x83, 0x84]],
  ['\uFFFD', [0x80, 0x81, 0x82, 0x83, 0x84, 0x85]],
  ['\uFFFD', [0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86]],

  // incomplete sequences
  // 2-byte
  ['\uFFFD', [0xc3]], // head + eos
  ['\uFFFD@', [0xc3, 0x40]], // head + valid 1-byte
  ['\uFFFDé', [0xc3, 0xc3, 0xa9]], // start + valid 2-byte

  // 3-byte
  ['\uFFFD', [0xe3]], // head + eos
  ['\uFFFD@', [0xe3, 0x40]], // head + valid 1-byte
  ['\uFFFDテ', [0xe3, 0xe3, 0x83, 0x86]], // head + valid 3-byte
  ['\uFFFD', [0xe3, 0x83]], // lead + eos
  ['\uFFFD@', [0xe3, 0x83, 0x40]], // lead + valid 1-byte
  ['\uFFFDテ', [0xe3, 0x83, 0xe3, 0x83, 0x86]], // lead + valid 3-byte

  // 4-byte
  ['\uFFFD', [0xf0]], // head + eos
  ['\uFFFD@', [0xf0, 0x40]], // head + valid 1-byte
  ['\uFFFD' + CROC, [0xf0, 0xf0, 0x9f, 0x90, 0x8a]], // head + valid 4-byte
  ['\uFFFD', [0xf0, 0x9f, 0x90]], // lead + eos
  ['\uFFFD@', [0xf0, 0x9f, 0x90, 0x40]], // lead + valid 1-byte
  ['\uFFFD' + CROC, [0xf0, 0x9f, 0x90, 0xf0, 0x9f, 0x90, 0x8a]], // lead + valid 4-byte

  // overlong sequences
  // slash
  ['\uFFFD', [0xc0, 0xaf]],
  ['\uFFFD', [0xc0, 0x80, 0xaf]],
  ['\uFFFD', [0xc0, 0x80, 0x80, 0xaf]],

  // null
  ['\uFFFD', [0xc0, 0x80]],
  ['\uFFFD', [0xc0, 0x80, 0x80]],
  ['\uFFFD', [0xc0, 0x80, 0x80, 0x80]],

  // boundary character - the highest overlong sequence for a given byte length
  ['\uFFFD', [0xc1, 0xbf]], // 0x7f
  ['\uFFFD', [0xe0, 0x9f, 0xbf]], // 0x7ff
  ['\uFFFD', [0xf0, 0x8f, 0xbf, 0xbf]], // 0xffff
];

const UTF16_TESTS = [
  ['', []],
  ['\x00', [0x0000]],
  ['A', [0x0041]],
  ['é', [0x00e9]],
  ['ε', [0x03b5]],
  ['\uD7FF', [0xd7ff]],
  ['\uE000', [0xe000]],
  ['\uD800\uDC00', [0xd800, 0xdc00]],
  ['\ud83c\udd63', [0xd83c, 0xdd63]], // typical non-emoji 🅣  U+1F163: NEGATIVE CIRCLED LATIN CAPITAL LETTER T
  [CROC, [0xd83d, 0xdc0a]],
  ['\ud840\udc16', [0xd840, 0xdc16]], // plane 2 hanzi 𠀖
  ['\uDBFF\uDFFF', [0xdbff, 0xdfff]],
];

const UTF32_TESTS = [
  ['', []],
  ['\x00', [0x00000000]],
  ['A', [0x00000041]],
  ['é', [0x000000e9]],
  ['ε', [0x000003b5]],
  ['\uD7FF', [0x0000d7ff]],
  ['\uE000', [0x0000e000]],
  ['\uFFFF', [0x0000ffff]],
  ['\uD800\uDC00', [0x00010000]],
  ['\ud83c\udd63', [0x0001f163]], // typical non-emoji 🅣  U+1F163: NEGATIVE CIRCLED LATIN CAPITAL LETTER T
  [CROC, [0x0001f40a]],
  ['\ud840\udc16', [0x00020016]], // plane 2 hanzi 𠀖
  ['\uDBFF\uDFFF', [0x0010ffff]],
];

const UTF32_REJECTS = [
  ['\uFFFD', [0x00110000]],
  ['\uFFFD', [0x7fffffff]],
  ['\uFFFD', [0xffffffff]],
];

describe('unicode#codec', () => {
  describe('UTF8.decode', () => {
    it('decodes correctly', () => {
      UTF8_TESTS.forEach((pair) => {
        var string = pair[0];
        var bytes = pair[1];
        assert.strictEqual(codec.UTF8.decode(bytes), string);
      });
    });

    it('rejects correctly', () => {
      UTF8_REJECTS.forEach((pair) => {
        var string = pair[0];
        var bytes = pair[1];

        var got = codec.UTF8.decode(bytes);
        var compare = collapseReplacementRuns(got);

        assert.strictEqual(compare, string);
      });
    });
  });

  describe('UTF8.encode', () => {
    it('encodes correctly', () => {
      UTF8_TESTS.forEach((pair) => {
        var string = pair[0];
        var bytes = pair[1];
        assert.deepEqual(codec.UTF8.encode(string), bytes);
      });
    });
  });

  describe('UTF16.decode', () => {
    it('decodes correctly', () => {
      UTF16_TESTS.forEach((pair) => {
        var string = pair[0];
        var words = pair[1];
        assert.strictEqual(codec.UTF16.decode(words), string);
      });
    });
  });

  describe('UTF16.encode', () => {
    it('encodes correctly', () => {
      UTF16_TESTS.forEach((pair) => {
        var string = pair[0];
        var words = pair[1];
        assert.deepEqual(codec.UTF16.encode(string), words);
      });
    });
  });

  describe('UTF32.decode', () => {
    it('decodes correctly', () => {
      UTF32_TESTS.forEach((pair) => {
        var string = pair[0];
        var ints = pair[1];
        assert.strictEqual(codec.UTF32.decode(ints), string);
      });
    });

    it('rejects correctly', () => {
      UTF32_REJECTS.forEach((pair) => {
        var string = pair[0];
        var ints = pair[1];

        var got = codec.UTF32.decode(ints);
        var compare = collapseReplacementRuns(got);

        assert.strictEqual(compare, string);
      });
    });
  });

  describe('UTF32.encode', () => {
    it('encodes correctly', () => {
      UTF32_TESTS.forEach((pair) => {
        var string = pair[0];
        var ints = pair[1];
        assert.deepEqual(codec.UTF32.encode(string), ints);
      });
    });
  });
});
