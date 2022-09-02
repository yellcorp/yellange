/**
 * @file unicode
 *
 * Environment-independent encoding and decoding of UTF-8/16/32 directly
 * to/from TypedArrays. Also, depending on ambition, perhaps some useful chunks
 * of the Unicode database. So far we have Grapheme Cluster Breaking.
 */

import * as codec from './codec';
import * as core from './core';
import * as gcb from './gcb';
import * as utf8 from './utf8';
import * as utf16 from './utf16';
import * as utf32 from './utf32';

export { codec, core, gcb, utf8, utf16, utf32 };
