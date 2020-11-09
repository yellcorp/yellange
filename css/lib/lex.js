import {
  codepointToString,
  isSurrogate,
  MAX_CODEPOINT,
  REPLACEMENT_CHARACTER,
} from '../../unicode/core';
import { UNQUOTED_URL_TERMINATOR, WHITESPACE } from './chartypes';

export function lexEscape(text, pos) {
  // eslint-disable-next-line no-control-regex
  const match = /^(?:\\([0-9A-Fa-f]{1,6}\s*)|(\x0D\x0A|\x0D|\x0A|\x0C)|(.))/.exec(
    text.slice(pos)
  );
  let literal;

  if (!match) {
    return [pos, null];
  }

  if (match[1]) {
    const codepoint = parseInt(match[1], 16);

    if (
      codepoint === 0 ||
      isSurrogate(codepoint) ||
      codepoint > MAX_CODEPOINT
    ) {
      literal = REPLACEMENT_CHARACTER;
    } else {
      literal = codepointToString(codepoint);
    }
  } else if (match[2]) {
    literal = '';
  } else {
    literal = match[3];
  }

  return [pos + match[0].length, literal];
}

export function lexString(text, pos) {
  const len = text.length;
  const closer = text[pos++];
  let string = '';
  let ch;

  while (pos < len) {
    ch = text[pos];
    if (ch === closer) {
      return [pos + 1, string];
    }

    if (ch === '\\') {
      [pos, ch] = lexEscape(text, pos);
      if (ch == null) {
        break;
      } else {
        string += ch;
      }
    } else if (ch === '\n' || ch === '\r' || ch === '\f') {
      break;
    } else {
      pos++;
      string += ch;
    }
  }

  return [pos, null];
}

export function lexUnquotedUrl(text, pos) {
  const len = text.length;
  let string = '';
  let ch;

  while (pos < len) {
    ch = text[pos];

    if (ch === '\\') {
      [pos, ch] = lexEscape(text, pos);
      if (ch == null) {
        break;
      } else {
        string += ch;
      }
    } else if (
      ch < '\t' ||
      (ch > '\r' && ch < ' ') ||
      WHITESPACE[ch] === 1 ||
      UNQUOTED_URL_TERMINATOR[ch] === 1
    ) {
      break;
    } else {
      pos++;
      string += ch;
    }
  }

  return [pos, string];
}
