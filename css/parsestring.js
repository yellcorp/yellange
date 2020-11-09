import { STRING_ENCLOSER, WHITESPACE } from './lib/chartypes';
import { lexString, lexUnquotedUrl } from './lib/lex';

/**
 * Parses a CSS string literal and returns the string it expresses.
 *
 * Whitespace is stripped before parsing is attempted.  After initial
 * whitespace, the argument must begin with either `"` (quote) or `'`
 * (apostrophe).
 *
 * @param {string} literal - The CSS string literal to parse.
 * @returns {string|null} The string, or `null` if parsing fails.
 */
export function parseString(literal) {
  literal = String(literal).trim();
  const [pos, str] = lexString(literal, 0);
  if (str == null || pos !== literal.length) {
    return null;
  }
  return str;
}

/**
 * Parses a CSS url() expression and returns the URL within it.
 *
 * The string is stripped of whitespace before parsing is attempted. It must
 * include `'url('` at its start to be recognized. Anything following the
 * closing `)` is ignored.
 *
 * @param {string} cssUrlExpr - The URL expression to parse.
 * @returns {string|null} The URL, or `null` if parsing fails.
 */
export function parseUrl(cssUrlExpr) {
  cssUrlExpr = String(cssUrlExpr).trim();

  if (cssUrlExpr.slice(0, 4).toLowerCase() !== 'url(') {
    return null;
  }

  let pos = 4;
  while (WHITESPACE[cssUrlExpr[pos]] === 1) {
    pos++;
  }

  let url;
  if (STRING_ENCLOSER[cssUrlExpr[pos]] === 1) {
    [pos, url] = lexString(cssUrlExpr, pos);
  } else {
    [pos, url] = lexUnquotedUrl(cssUrlExpr, pos);
  }

  while (WHITESPACE[cssUrlExpr[pos]] === 1) {
    pos++;
  }

  if (cssUrlExpr[pos] !== ')') {
    return null;
  }

  return url;
}
