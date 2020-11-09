import { assert } from 'chai';

import { urlEncode } from '../../urlencoding';

function p(number) {
  // produces a regex that matches the percent-encoded form of number. the
  // returned value begins with a percent. if a digit is in the range 0-9,
  // it appears literally. if a digit is in the range A-F, it is
  // represented as a character class that matches both its upper and lower
  // case. this is so it can be used as part of a case-sensitive regex.
  let str = '%';

  for (let shift = 4; shift >= 0; shift -= 4) {
    const digit = (number >> shift) & 0xf;
    if (digit <= 9) {
      str += digit;
    } else {
      str +=
        '[' +
        String.fromCharCode(0x37 + digit) +
        String.fromCharCode(0x57 + digit) +
        ']';
    }
  }

  return str;
}

function regex(...parts) {
  return new RegExp('^' + parts.join('') + '$');
}

describe('urlencoding#urlEncode()', () => {
  const tests = [
    ['encodes empty arrays', [], /^$/],
    [
      'encodes bytes correctly',

      // A, a, %, space, null, U+0001, slash, cr, lf, 0xFF
      [0x41, 0x61, 0x25, 0x20, 0, 1, 0x2f, 0xd, 0xa],
      regex('Aa', p(0x25), p(0x20), p(0), p(1), p(0x2f), p(0xd), p(0xa)),
    ],
    [
      'encodes sequences that could be problematic as text',
      [0xfe, 0xff, 0xff, 0xaa, 0, 0, 0xdc, 0, 0xd8, 0, 1],
      regex(
        p(0xfe),
        p(0xff),
        p(0xff),
        p(0xaa),
        p(0),
        p(0),
        p(0xdc),
        p(0),
        p(0xd8),
        p(0),
        p(1)
      ),
    ],
  ];

  for (const [name, input, expectRegex] of tests) {
    it(name, () => assert.match(urlEncode(input), expectRegex));
  }
});
