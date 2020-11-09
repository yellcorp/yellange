export const MAX_CODEPOINT = 0x10ffff;
export const MAX_BMP_CODEPOINT = 0xffff;
export const MIN_SUPPLEMENTARY_CODEPOINT = 0x10000;

export const REPLACEMENT_CHARACTER_CODEPOINT = 0xfffd;
export const REPLACEMENT_CHARACTER = '\uFFFD';

export const MIN_LEAD_SURROGATE = 0xd800;
export const MAX_LEAD_SURROGATE = 0xdbff;
export function isLeadSurrogate(n) {
  return n >= MIN_LEAD_SURROGATE && n <= MAX_LEAD_SURROGATE;
}

export const MIN_TRAIL_SURROGATE = 0xdc00;
export const MAX_TRAIL_SURROGATE = 0xdfff;
export function isTrailSurrogate(n) {
  return n >= MIN_TRAIL_SURROGATE && n <= MAX_TRAIL_SURROGATE;
}

export const MIN_SURROGATE = MIN_LEAD_SURROGATE;
export const MAX_SURROGATE = MAX_TRAIL_SURROGATE;
export function isSurrogate(n) {
  return n >= MIN_SURROGATE && n <= MAX_SURROGATE;
}

export function decodeSurrogatePair(lead, trail) {
  if (isLeadSurrogate(lead) && isTrailSurrogate(trail)) {
    return (
      MIN_SUPPLEMENTARY_CODEPOINT + ((lead & 0x3ff) << 10) + (trail & 0x3ff)
    );
  }
  return -1;
}

export function decodeSurrogatePairString(s) {
  return decodeSurrogatePair(s.charCodeAt(0), s.charCodeAt(1));
}

export function leadSurrogateForCodepoint(c) {
  return MIN_LEAD_SURROGATE + ((c - MIN_SUPPLEMENTARY_CODEPOINT) >>> 10);
}

export function trailSurrogateForCodepoint(c) {
  return MIN_TRAIL_SURROGATE + ((c - MIN_SUPPLEMENTARY_CODEPOINT) & 0x3ff);
}

export function codepointToUTF16(c) {
  if (c < MIN_SUPPLEMENTARY_CODEPOINT) {
    return [c];
  }

  c -= MIN_SUPPLEMENTARY_CODEPOINT;
  return [MIN_LEAD_SURROGATE + (c >>> 10), MIN_TRAIL_SURROGATE + (c & 0x3ff)];
}

export function codepointToString(c) {
  if (c < MIN_SUPPLEMENTARY_CODEPOINT) {
    return String.fromCharCode(c);
  }

  c -= MIN_SUPPLEMENTARY_CODEPOINT;
  return String.fromCharCode(
    MIN_LEAD_SURROGATE + (c >>> 10),
    MIN_TRAIL_SURROGATE + (c & 0x3ff)
  );
}

export function codepointOf(ch) {
  if (!ch) {
    return NaN;
  }

  const lead = ch.charCodeAt(0);
  if (isLeadSurrogate(lead)) {
    const trail = ch.charCodeAt(1);
    if (isTrailSurrogate(trail)) {
      return (
        MIN_SUPPLEMENTARY_CODEPOINT + ((lead & 0x3ff) << 10) + (trail & 0x3ff)
      );
    }
  }

  return lead;
}
