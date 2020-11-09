import { UTF32 } from './codec';
import { memoize0, memoize1 } from '../memo';

// const naming comes directly from the spec, via unicode's data files
/* eslint-disable camelcase */

/* eslint-disable
   array-bracket-newline, comma-dangle, comma-style, indent, max-len */
// BEGIN GENERATED CODE

// prettier-ignore
~"consts";

// prettier-ignore
const STRIPES_RLE = ~"stripesRle";

// prettier-ignore
const PLANES_RLE = ~"planesRle";

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
