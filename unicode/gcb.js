import { UTF32 } from './codec';
import { memoize0, memoize1 } from '../memo';

// const naming comes directly from the spec, via unicode's data files
/* eslint-disable camelcase */

/* eslint-disable
   array-bracket-newline, comma-dangle, comma-style, indent, max-len */
// BEGIN GENERATED CODE

// prettier-ignore
const GCB_Other = 0;
const GCB_Prepend = 1;
const GCB_CR = 2;
const GCB_LF = 3;
const GCB_Control = 4;
const GCB_Extend = 5;
const GCB_Regional_Indicator = 6;
const GCB_SpacingMark = 7;
const GCB_L = 8;
const GCB_V = 9;
const GCB_T = 10;
const GCB_LV = 11;
const GCB_LVT = 12;
const GCB_E_Base = 13;
const GCB_E_Modifier = 14;
const GCB_ZWJ = 15;
const GCB_Glue_After_Zwj = 16;
const GCB_E_Base_GAZ = 17;
const GCB_EOT = 18;

// prettier-ignore
const STRIPES_RLE = [
  5, 292, 3, 36, 2, 548, 3008, 1028, 384, 4, 10784, 3557, 8768, 197, 8384, 1413, 0, 5, 0, 37, 0, 37, 0, 5, 1760, 161,
  288, 325, 0, 4, 1440, 645, 480, 5, 3200, 197, 1, 0, 165, 32, 37, 0, 101, 1024, 1, 0, 5, 928, 837, 2880, 325, 1824, 261
  , 1056, 101, 0, 261, 0, 69, 0, 133, 1344, 69, 3808, 421, 1, 997, 7, 1696, 5, 7, 5, 0, 71, 229, 103, 5, 39, 0, 197, 288
  , 37, 896, 5, 39, 1760, 5, 0, 5, 39, 101, 32, 39, 32, 39, 5, 256, 5, 288, 37, 896, 37, 7, 1760, 5, 0, 71, 37, 96, 37,
  32, 69, 64, 5, 928, 37, 64, 5, 320, 37, 7, 1760, 5, 0, 71, 133, 0, 37, 7, 0, 39, 5, 608, 37, 672, 165, 0, 5, 39, 1760
  , 5, 0, 37, 7, 101, 32, 39, 32, 39, 5, 224, 37, 288, 37, 928, 5, 1856, 5, 7, 5, 39, 64, 71, 0, 71, 5, 256, 5, 1248, 5
  , 71, 1824, 69, 103, 0, 69, 0, 101, 192, 37, 320, 37, 896, 5, 39, 1760, 5, 0, 7, 5, 39, 5, 39, 0, 5, 39, 0, 39, 37,
  192, 37, 320, 37, 864, 37, 39, 1728, 37, 0, 5, 39, 101, 0, 71, 0, 71, 5, 1, 224, 5, 288, 37, 928, 39, 2208, 5, 96, 5,
  39, 69, 0, 5, 0, 199, 5, 544, 39, 1920, 5, 0, 7, 197, 352, 229, 3104, 5, 0, 7, 165, 0, 37, 320, 165, 2336, 37, 832, 5
  , 0, 5, 0, 5, 96, 39, 1536, 421, 7, 133, 0, 37, 128, 325, 0, 1125, 256, 5, 3232, 101, 7, 165, 0, 37, 39, 37, 704, 39,
  37, 96, 69, 480, 101, 384, 5, 0, 7, 37, 160, 5, 448, 5, 3104, 3048, 2281, 2794, 2944, 69, 5664, 69, 896, 69, 896, 37,
  928, 37, 2016, 37, 7, 197, 231, 5, 39, 325, 256, 5, 1408, 69, 4, 3744, 37, 1056, 5, 3744, 69, 103, 37, 71, 96, 39, 5,
  167, 69, 6976, 37, 39, 5, 1792, 7, 5, 7, 197, 0, 5, 0, 5, 32, 229, 167, 293, 32, 5, 1504, 453, 2048, 101, 7, 1472, 5,
  7, 133, 7, 5, 135, 5, 39, 1184, 261, 352, 37, 7, 928, 7, 101, 39, 37, 7, 69, 1760, 5, 7, 37, 71, 5, 7, 69, 39, 1504,
  231, 229, 39, 37, 4832, 69, 0, 389, 7, 197, 96, 5, 96, 39, 5, 32, 7, 37, 6304, 1829, 0, 133, 320, 4, 5, 15, 36, 736,
  196, 1536, 484, 3040, 1029, 1376, 13, 1056, 16, 0, 16, 2592, 48, 3104, 13, 416, 16, 0, 109, 2720, 16, 12576, 69, 4480
  , 5, 3040, 997, 1312, 165, 3328, 37, 6752, 101, 0, 293, 992, 37, 2528, 37, 480, 5, 64, 5, 96, 5, 704, 39, 37, 7, 2784
  , 39, 1568, 487, 37, 800, 549, 1632, 229, 768, 325, 39, 352, 904, 64, 69, 7, 1472, 5, 39, 101, 39, 5, 103, 1120, 5,
  2112, 165, 39, 37, 39, 37, 352, 5, 224, 5, 7, 1440, 5, 1600, 5, 0, 69, 32, 37, 128, 37, 0, 5, 1280, 7, 37, 39, 128, 7
  , 5, 7520, 39, 5, 39, 5, 39, 0, 7, 5, 544, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11
  , 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11
  , 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11
  , 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11
  , 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 11
  , 844, 11, 844, 11, 844, 11, 1612, 11, 844, 11, 844, 11, 844, 11, 844, 11, 844, 352, 713, 96, 1546, 96, 8164, 928, 5,
  7168, 485, 480, 485, 6592, 4, 5024, 37, 2528, 356, 8192, 5, 7200, 5, 4736, 133, 4256, 69, 0, 37, 128, 101, 1248, 69,
  96, 5, 5248, 37, 768, 7, 5, 7, 1664, 453, 1760, 69, 7, 1408, 71, 101, 39, 37, 32, 1, 2080, 69, 1120, 133, 7, 229, 1952
  , 5, 352, 37, 7, 1504, 71, 261, 39, 0, 33, 160, 69, 3008, 71, 69, 39, 5, 7, 37, 160, 5, 5088, 5, 71, 229, 640, 37, 39
  , 1760, 5, 0, 5, 7, 5, 103, 32, 39, 32, 71, 256, 5, 288, 39, 32, 197, 64, 133, 6112, 71, 229, 39, 69, 7, 5, 3328, 5,
  39, 165, 7, 5, 39, 5, 7, 37, 7, 37, 7488, 5, 39, 101, 32, 103, 37, 7, 37, 832, 37, 2592, 71, 229, 39, 5, 7, 37, 3360,
  5, 7, 5, 39, 165, 7, 5, 3200, 69, 39, 101, 7, 133, 6784, 165, 39, 37, 1248, 165, 7, 1, 101, 224, 5, 256, 165, 39, 69,
  1312, 97, 389, 7, 37, 4736, 7, 197, 0, 165, 7, 5, 2592, 677, 0, 7, 197, 7, 37, 7, 37, 3872, 165, 64, 5, 0, 37, 0, 197
  , 1, 5, 13536, 133, 1856, 197, 8992, 1447, 480, 101, 8480, 37, 0, 100, 6144, 5, 7, 69, 64, 7, 133, 228, 229, 32, 197,
  928, 101, 4704, 69, 5952, 1733, 96, 1573, 224, 5, 416, 5, 672, 133, 0, 453, 2528, 197, 0, 517, 32, 197, 0, 37, 0, 133
  , 13440, 197, 3456, 197, 13120, 806, 224, 16, 1664, 16, 1632, 16, 512, 13, 384, 16, 480, 16, 64, 16, 768, 77, 32, 13,
  32, 77, 928, 16, 0, 16, 384, 142, 2080, 45, 32, 333, 640, 113, 96, 13, 0, 269, 64, 13, 96, 77, 0, 77, 64, 16, 928, 13
  , 480, 48, 3360, 16, 96, 16, 2240, 45, 96, 13, 640, 13, 96, 45, 2560, 16, 2912, 77, 64, 141, 1504, 16, 512, 16, 480,
  13, 480, 77, 256, 13, 320, 13, 2368, 141, 0, 45, 160, 13, 256, 301, 64, 45, 4640, 397, 1056, 996, 3045, 4068, 7653,
  484
];

// prettier-ignore
const PLANES_RLE = [
  [ 6, 0, 65, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 1, 17, 129, 18, 19, 20, 21, 22, 23, 24, 65, 25, 257,
  26, 27, 193, 28, 29, 65, 30, 7425, 31, 1, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 36, 37, 38, 39, 40, 41, 42, 36,
  37, 38, 39, 40, 41, 42, 36, 37, 38, 39, 40, 41, 42, 36, 37, 38, 39, 40, 41, 42, 36, 37, 38, 39, 40, 41, 42, 36, 43,
  492, 1665, 45, 65, 46, 47 ], [ 7, 1, 48, 49, 50, 641, 51, 513, 52, 53, 54, 55, 56, 57, 58, 59, 129, 60, 1, 61, 62,
  9601, 63, 64, 257, 65, 9601, 66, 2433, 67, 68, 769, 69, 513, 70, 769, 71, 72, 769, 73, 1, 74, 75, 76, 77, 129, 78, 641
   ], null, null, null, null, null, null, null, null, null, null, null, null, [ 7, 79, 80, 1708, 30593 ], null, null
];

// END GENERATED CODE
/* eslint-enable
   array-bracket-newline, comma-dangle, comma-style, indent, max-len */

function unpackRle(codes) {
  const shift = codes[0];
  const length = codes.length;
  const mask = (1 << shift) - 1;

  const table = [];

  for (let i = 1; i < length; i++) {
    const c = codes[i];
    let repeat = (c >> shift) + 1;
    const value = c & mask;
    while (repeat--) {
      table.push(value);
    }
  }

  return table;
}

const getStripes = memoize0(() => unpackRle(STRIPES_RLE));

const getPlaneBases = memoize1((plane) => {
  const pbRle = PLANES_RLE[plane];
  if (!pbRle) {
    return null;
  }
  const planeBases = unpackRle(pbRle);
  for (let i = 0; i < planeBases.length; i++) {
    planeBases[i] <<= 8;
  }
  return planeBases;
});

function gcbProperty(cp) {
  const plane = cp >>> 16;

  const planeBases = getPlaneBases(plane);
  if (!planeBases) {
    return GCB_Other;
  }

  const stripeBase = planeBases[(cp >> 8) & 0xff];
  return getStripes()[stripeBase | (cp & 0xff)];
}

export function splitCodepoints(codepoints) {
  const sequences = [];

  const imax = codepoints.length;
  const ifinal = imax - 1;

  let i = 0;
  let cstart = 0;
  let fuseRI = true;

  let a;
  let b = i === imax ? GCB_EOT : gcbProperty(codepoints[i]);

  // GB10 is like a regex; implement it as a state machine
  let gb10state = 0;

  for (i = 0; i < imax; i++) {
    let gcBreak = true;

    a = b;
    b = i === ifinal ? GCB_EOT : gcbProperty(codepoints[i + 1]);

    do {
      // advance GB10 state machine before anything else
      if (
        (gb10state === 0 && (a === GCB_E_Base || a === GCB_E_Base_GAZ)) ||
        gb10state === 1
      ) {
        switch (b) {
          case GCB_Extend:
            gb10state = 1;
            break;
          case GCB_E_Modifier:
            gb10state = 2;
            break;
          default:
            gb10state = 0;
            break;
        }
      }

      // GB1 is implicit

      // GB2
      if (b === GCB_EOT) {
        gcBreak = true;
        break;
      }

      // GB3
      if (a === GCB_CR && b === GCB_LF) {
        gcBreak = false;
        break;
      }

      // GB4, GB5
      if (
        a === GCB_Control ||
        a === GCB_CR ||
        a === GCB_LF ||
        b === GCB_Control ||
        b === GCB_CR ||
        b === GCB_LF
      ) {
        gcBreak = true;
        break;
      }

      // GB6 - 8
      if (
        (a === GCB_L &&
          (b === GCB_L || b === GCB_V || b === GCB_LV || b === GCB_LVT)) ||
        ((a === GCB_LV || a === GCB_V) && (b === GCB_V || b === GCB_T)) ||
        ((a === GCB_LVT || a === GCB_T) && b === GCB_T)
      ) {
        gcBreak = false;
        break;
      }

      if (
        b === GCB_Extend ||
        b === GCB_ZWJ || // GB9
        b === GCB_SpacingMark || // GB9a
        a === GCB_Prepend // GB9b
      ) {
        gcBreak = false;
        break;
      }

      // GB10
      if (gb10state === 2) {
        gb10state = 0;
        gcBreak = false;
        break;
      }

      // GB11
      if (a === GCB_ZWJ && (b === GCB_Glue_After_Zwj || b === GCB_E_Base_GAZ)) {
        gcBreak = false;
        break;
      }

      // GB12, GB13
      if (
        fuseRI &&
        a === GCB_Regional_Indicator &&
        b === GCB_Regional_Indicator
      ) {
        fuseRI = false;
        gcBreak = false;
        break;
      }
      fuseRI = true;

      // GB999: implicit because gcBreak is set to true at the beginning of the
      // block

      // this do-while-false construct means 'break' has the effect of 'goto
      // here', so you can have goto in JavaScript, just like you always wanted
      // eslint-disable-next-line no-constant-condition
    } while (false);

    if (gcBreak) {
      sequences.push(codepoints.slice(cstart, i + 1));
      cstart = i + 1;
    }
  }

  return sequences;
}

export function splitString(string) {
  const u32Array = UTF32.encode(string);
  const sequences = splitCodepoints(u32Array);
  const strings = [];
  for (let i = 0; i < sequences.length; i++) {
    strings.push(UTF32.decode(sequences[i]));
  }
  return strings;
}
