// functions and consts defined by W3C Compositing and Blending Level 1

import { getLumaWeights } from './colorspace';

const [LUMA_RED, LUMA_GREEN, LUMA_BLUE] = getLumaWeights('w3c_compositing');

function lum(c) {
  return LUMA_RED * c[0] + LUMA_GREEN * c[1] + LUMA_BLUE * c[2];
}

function _clipColor(uc) {
  const l = lum(uc);
  const n = Math.min(...uc);
  const x = Math.max(...uc);

  const c = [uc[0], uc[1], uc[2]];
  if (n < 0) {
    for (let i = 0; i < 3; i++) {
      c[i] = l + ((c[i] - l) * l) / (l - n);
    }
  }
  if (x > 1) {
    for (let i = 0; i < 3; i++) {
      c[i] = l + ((c[i] - l) * (1 - l)) / (x - l);
    }
  }
  return c;
}

function setLum(c, l) {
  const d = l - lum(c);
  return _clipColor([c[0] + d, c[1] + d, c[2] + d]);
}

function sat(c) {
  return Math.max(...c) - Math.min(...c);
}

function setSat(uc, s) {
  let max, mid, min;
  if (uc[0] > uc[1]) {
    if (uc[1] > uc[2]) {
      max = 0;
      mid = 1;
      min = 2;
    } else if (uc[0] > uc[2]) {
      max = 0;
      mid = 2;
      min = 1;
    } else {
      max = 2;
      mid = 0;
      min = 1;
    }
  } else if (uc[2] > uc[1]) {
    max = 2;
    mid = 1;
    min = 0;
  } else if (uc[0] > uc[2]) {
    max = 1;
    mid = 0;
    min = 2;
  } else {
    max = 1;
    mid = 2;
    min = 0;
  }

  const c = [uc[0], uc[1], uc[2]];
  if (c[max] > c[min]) {
    c[mid] = ((c[mid] - c[min]) * s) / (c[max] - c[min]);
    c[max] = s;
  } else {
    c[mid] = c[max] = 0;
  }
  c[min] = 0;
  return c;
}

// end W3C functions

// separable blend modes. each rgb channel can be processed independently
// of each other:

// ucb - unpremultiplied color backdrop (Cb in W3C spec formulae)
// ucs - unpremultiplied color source   (Cs in W3C spec formulae)

// these functions accept and return scalar numeric values in the range 0-1

export function sourceOver(_ucb, ucs) {
  return ucs;
}

export function multiply(ucb, ucs) {
  return ucb * ucs;
}

export function screen(ucb, ucs) {
  return ucb + ucs - ucb * ucs;
}

export function darken(ucb, ucs) {
  return ucb < ucs ? ucb : ucs;
}

export function lighten(ucb, ucs) {
  return ucb > ucs ? ucb : ucs;
}

export function colorDodge(ucb, ucs) {
  return ucb === 0 ? 0 : ucs === 1 ? 1 : Math.min(1, ucb / (1 - ucs));
}

export function colorBurn(ucb, ucs) {
  return ucb === 1 ? 1 : ucs === 0 ? 0 : 1 - Math.min(1, (1 - ucb) / ucs);
}

export function hardLight(ucb, ucs) {
  return ucs <= 0.5 ? ucb * 2 * ucs : ucb + (2 * ucs - 1) * (1 - ucb);
}

export function overlay(ucb, ucs) {
  return hardLight(ucs, ucb);
}

export function softLight(ucb, ucs) {
  if (ucs <= 0.5) {
    return ucb - (1 - 2 * ucs) * ucb * (1 - ucb);
  }
  const d = ucb <= 0.25 ? ((16 * ucb - 12) * ucb + 4) * ucb : Math.sqrt(ucb);
  return ucb + (2 * ucs - 1) * (d - ucb);
}

export function difference(ucb, ucs) {
  return Math.abs(ucb - ucs);
}

export function exclusion(ucb, ucs) {
  return ucb + ucs - 2 * ucb * ucs;
}

// non separable blend modes. these functions must consider the rgb triplet
// of each pixel as a whole

// these functions accept and return 3-vectors as arrays of numeric values
// in the range [ 0, 0, 0 ] - [ 1, 1, 1 ]

export function hue(ucb, ucs) {
  return setLum(setSat(ucs, sat(ucb)), lum(ucb));
}

export function saturation(ucb, ucs) {
  return setLum(setSat(ucb, sat(ucs)), lum(ucb));
}

export function color(ucb, ucs) {
  return setLum(ucs, lum(ucb));
}

export function luminosity(ucb, ucs) {
  return setLum(ucb, lum(ucs));
}
