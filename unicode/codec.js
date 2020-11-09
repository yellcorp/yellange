import { utf8Decode, utf8Encode } from './utf8';
import { utf16Decode, utf16Encode } from './utf16';
import { utf32Decode, utf32Encode } from './utf32';

export const UTF8 = {
  decode: utf8Decode,
  encode: utf8Encode,
};

export const UTF16 = {
  decode: utf16Decode,
  encode: utf16Encode,
};

export const UTF32 = {
  decode: utf32Decode,
  encode: utf32Encode,
};
