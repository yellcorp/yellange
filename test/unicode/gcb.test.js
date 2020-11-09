import { assert } from 'chai';

import * as codec from '../../unicode/codec';
import * as gcb from '../../unicode/gcb';
import { testData } from './_gcb-test-data';

describe('codec', () => {
  describe('splitCodepoints', () => {
    it('returns empty array for empty array', () => {
      assert.deepEqual(gcb.splitCodepoints([]), []);
    });

    it('passes official Unicode tests', () => {
      testData.forEach((lineInputExpect) => {
        const line = lineInputExpect[0];
        const input = lineInputExpect[1];
        const expect = lineInputExpect[2];

        const got = gcb.splitCodepoints(input);

        assert.deepEqual(
          got,
          expect,
          'Mismatch at GraphemeBreakTest.txt line #' + line
        );
      });
    });
  });

  describe('splitString', () => {
    it('returns empty array for empty string', () => {
      assert.deepEqual(gcb.splitString(''), []);
    });

    it('passes official Unicode tests', () => {
      testData.forEach((lineInputExpect) => {
        const line = lineInputExpect[0];
        const input = codec.UTF32.decode(lineInputExpect[1]);
        const expect = lineInputExpect[2].map((c) => codec.UTF32.decode(c));

        const got = gcb.splitString(input);

        assert.deepEqual(
          got,
          expect,
          'Mismatch at GraphemeBreakTest.txt line #' + line
        );
      });
    });
  });
});
