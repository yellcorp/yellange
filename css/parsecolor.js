import { hsl2rgb } from '../color';
import { COLOR_KEYWORDS } from './lib/colorkeywords';

const hasOwn = Object.prototype.hasOwnProperty;

function clamp(v, low, high) {
  return v < low ? low : v > high ? high : v;
}

function pPercent(text) {
  const match = /^(\d+|\d*\.\d+)%$/.exec(text);
  return match ? parseFloat(match[1]) / 100 : NaN;
}

function pFloat(text) {
  const match = /^(?:\d+|\d*\.\d+)$/.exec(text);
  return match ? parseFloat(match[0]) : NaN;
}

function pInt(text) {
  const match = /^\d+$/.exec(text);
  return match ? parseInt(match[0], 10) : NaN;
}

function parseFunc(argText, colorModel, expectAlpha) {
  // bookending with commas lets us use the whitespace regex to trim the first
  // and last args. just have to remember we start from 1 and have 2 extra args
  const args = (',' + argText + ',').split(/\s*,\s*/);

  if (args.length !== (expectAlpha ? 6 : 5)) {
    return null;
  }

  const parsedArgs = [];
  if (colorModel === 'rgb') {
    if (args[1].slice(-1) === '%') {
      for (let i = 0; i < 3; i++) {
        parsedArgs[i] = (clamp(pPercent(args[i + 1]), 0, 1) * 255 + 0.5) | 0;
      }
    } else {
      for (let i = 0; i < 3; i++) {
        parsedArgs[i] = clamp(pInt(args[i + 1]), 0, 255);
      }
    }
  } else if (colorModel === 'hsl') {
    parsedArgs[0] = pFloat(args[1]);
    for (let i = 1; i < 3; i++) {
      parsedArgs[i] = clamp(pPercent(args[i + 1]), 0, 1);
    }
    hsl2rgb(parsedArgs, parsedArgs);
    for (let i = 0; i < 3; i++) {
      parsedArgs[i] = (clamp(parsedArgs[i], 0, 1) * 255 + 0.5) | 0;
    }
  } else {
    return null;
  }

  if (expectAlpha) {
    parsedArgs[3] = clamp(pFloat(args[4]), 0, 1);
  }

  for (let i = 0; i < parsedArgs.length; i++) {
    if (isNaN(parsedArgs[i])) {
      return null;
    }
  }
  return parsedArgs;
}

function parseHex(text) {
  if (!/^#[\da-f]{3,6}$/i.test(text)) {
    return null;
  }

  switch (text.length) {
    case 4:
      return [
        0x11 * parseInt(text[1], 16),
        0x11 * parseInt(text[2], 16),
        0x11 * parseInt(text[3], 16),
      ];

    case 7:
      return [
        parseInt(text.slice(1, 3), 16),
        parseInt(text.slice(3, 5), 16),
        parseInt(text.slice(5), 16),
      ];

    default:
      return null;
  }
}

function splitInt24(n) {
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/**
 * Parses a CSS color and returns its red, green, blue components, and alpha if
 * present.
 *
 * The result is returned as an array, with red in index 0, green in index 1,
 * and blue in index 2. These components are in the range 0-255.
 *
 * If alpha was explicitly specified in the CSS color, the returned array has 4
 * elements with the alpha in index 3, with the range 0-1. Otherwise, the
 * returned array has 3 elements.
 *
 * The following formats from the CSS Color Module Level 3 spec are recognized:
 * - 4.1 Basic color keywords
 * - 4.2 Numerical color values (HSL colors are converted to RGB)
 * - 4.3 Extended color keywords
 *
 * The following are not recognized:
 * - 4.4 'currentColor' color keyword
 * - 4.5 CSS system colors
 *
 * @param {string} color - The CSS color to parse.
 * @returns {number[]} The color components.
 */
export function parseColor(color) {
  if (typeof color === 'number') {
    // also accept RRGGBB ints I guess
    return splitInt24(color);
  }

  const stext = String(color).trim().toLowerCase();

  if (stext[0] === '#') {
    return parseHex(stext);
  }

  if (hasOwn.call(COLOR_KEYWORDS, stext)) {
    return splitInt24(COLOR_KEYWORDS[stext]);
  }

  if (stext.charAt(stext.length - 1) === ')') {
    const funcMatch = /^(rgb|hsl)(a?)\(/.exec(stext);
    if (funcMatch) {
      return parseFunc(
        stext.slice(funcMatch[0].length, -1),
        funcMatch[1],
        funcMatch[2] === 'a'
      );
    }
    return null;
  }

  color = color.toLowerCase();
  if (color === 'transparent') {
    return [0, 0, 0, 0];
  }

  return null;
}
