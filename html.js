/**
 * @file html: tag generation and entity escaping
 */

import { codepointOf } from './unicode/core';

function charEscaper(nameTable) {
  return (ch) => {
    if (!ch) {
      return '';
    }

    const sequence = nameTable[ch];
    if (typeof sequence === 'string') {
      return sequence;
    }

    return numericEntity(ch);
  };
}

function stringEscaper(regex, escaper) {
  return (s) => String(s).replace(regex, escaper);
}

export function numericEntity(character) {
  return `&#${codepointOf(String(character))};`;
}

export const entityEscapeAttribute = stringEscaper(
  /[\x00-\x1f&<>"'`\x7f]/g,
  charEscaper({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  })
);

export const entityEscapeText = stringEscaper(
  /[\x00-\x1f&<>\x7f]/g,
  charEscaper({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  })
);

export function openTag(tagName, attrs = null) {
  let markup = `<${tagName}`;
  if (attrs) {
    for (const k of Object.keys(attrs)) {
      const v = attrs[k];
      if (v != null && v !== false) {
        markup += ` ${k}`;
        if (v !== true) {
          markup += `="${entityEscapeAttribute(v)}"`;
        }
      }
    }
  }
  return markup + '>';
}
