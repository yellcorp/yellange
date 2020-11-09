import { unitParser } from './lib/unitparser';

/**
 * Parses a CSS angle and returns the number of radians it represents.
 */
export const parseAngle = unitParser({
  rad: 1,
  deg: Math.PI / 180,
  grad: Math.PI / 200,
  turn: Math.PI * 2,
});

/**
 * Parses a CSS distance and returns the number of pixels it represents.
 *
 * Only accepts units that have a fixed relationship to pixels per the CSS
 * spec: `cm`, `mm`, `in`, `pt`, `pc` and `px`.
 */
export const parseDistance = unitParser({
  px: 1,
  cm: 9600 / 254,
  mm: 96000 / 254,
  in: 96,
  pt: 96 / 72,
  pc: 16,
});

/**
 * Parses a CSS duration and returns the number of milliseconds it
 * represents.
 */
export const parseDuration = unitParser({
  ms: 1,
  s: 1000,
});
