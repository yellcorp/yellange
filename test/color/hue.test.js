import { floatArraysEqualWithin } from '../testlib/assert';
import { DATA } from './huedata';

import { hsl2rgb, hsv2rgb, rgb2hsl, rgb2hsv } from '../../color';

const R = 0;
const G = 1;
const B = 2;
const H = 3;
const V = 4;
const L = 5;
const Shsv = 6;
const Shsl = 7;

// prettier-ignore-end

const HUE_TOLERANCE = 360e-3;
const TOLERANCE = 1e-3;

function generate(testFunc, assertFunc, in0, in1, in2, out0, out1, out2) {
  for (const row of DATA) {
    const input = [row[in0], row[in1], row[in2]];
    const expect = [row[out0], row[out1], row[out2]];

    const got = testFunc(input);
    assertFunc(got, expect);
  }
}

describe('color#rgb2hsl', () => {
  it('works', () => {
    generate(
      rgb2hsl,
      floatArraysEqualWithin([HUE_TOLERANCE, TOLERANCE, TOLERANCE]),
      R,
      G,
      B,
      H,
      Shsl,
      L
    );
  });
});

describe('color#rgb2hsv', () => {
  it('works', () => {
    generate(
      rgb2hsv,
      floatArraysEqualWithin([HUE_TOLERANCE, TOLERANCE, TOLERANCE]),
      R,
      G,
      B,
      H,
      Shsv,
      V
    );
  });
});

describe('color#hsl2rgb', () => {
  it('works', () => {
    generate(hsl2rgb, floatArraysEqualWithin(TOLERANCE), H, Shsl, L, R, G, B);
  });
});

describe('color#hsv2rgb', () => {
  it('works', () => {
    generate(hsv2rgb, floatArraysEqualWithin(TOLERANCE), H, Shsv, V, R, G, B);
  });
});
