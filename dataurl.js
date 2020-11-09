/**
 * @file dataurl: Data URL construction, introspection, decoding.
 */
import { MediaType } from './lib/dataurl/mediatype';
import { base64Decode, base64Encode } from './base64';
import { urlDecode, urlEncode } from './urlencoding';

const VALID = {};
const CODECS = {
  base64: {
    valid: VALID,
    encode: base64Encode,
    decode: base64Decode,
  },
  url: {
    valid: VALID,
    encode: urlEncode,
    decode: urlDecode,
  },
};

function copyArray(source, target) {
  const length = Math.min(source.length, target.length);
  for (let i = 0; i < length; i++) {
    target[i] = source[i];
  }
}

export class DataURL {
  constructor() {
    this._mediaType = new MediaType();

    this._encoding = 'url';
    this._codec = CODECS.url;

    this._decodedData = null;
    this._encodedData = null;
  }

  get mediaType() {
    return this._mediaType;
  }

  get encoding() {
    return this._encoding;
  }

  set encoding(newEncoding) {
    if (!newEncoding || newEncoding === this._encoding) {
      return;
    }

    const newCodec = CODECS[newEncoding];
    if (!newCodec || newCodec.valid !== VALID) {
      return;
    }

    if (this._decodedData == null) {
      this._decode();
    }
    this._encodedData = null;

    this._encoding = newEncoding;
    this._codec = newCodec;
  }

  toString() {
    if (this._encodedData == null) {
      this._encode();
    }
    return `data:${this._mediaType.get()},${this._encodedData}`;
  }

  getData(outArray) {
    if (this._decodedData == null) {
      this._decode();
    }
    if (!outArray) {
      outArray = new Uint8Array(this._decodedData.length);
    }

    if (typeof outArray.set === 'function') {
      outArray.set(this._decodedData);
    } else {
      copyArray(this._decodedData, outArray);
    }
    return outArray;
  }

  setData(newByteArray) {
    if (!newByteArray) {
      newByteArray = [];
    }
    this._encodedData = null;
    this._decodedData = new Uint8Array(newByteArray.length);
    this._decodedData.set(newByteArray);
  }

  parse(dataUrl) {
    const str = String(dataUrl);
    if (str.length < 6 || str.slice(0, 5) !== 'data:') {
      throw new Error('Not a Data URL');
    }

    const comma = str.indexOf(',', 5);
    if (comma < 0) {
      throw new Error('Not a Data URL: missing encoded data');
    }

    const mediaTypeParams = str.slice(5, comma).split(';');
    this._encoding = 'url';
    if (mediaTypeParams[mediaTypeParams.length - 1] === 'base64') {
      this._encoding = mediaTypeParams.pop();
    }
    this._mediaType.set(mediaTypeParams.join(';'));
    this._codec = CODECS[this._encoding];

    this._encodedData = str.slice(comma + 1);
    this._decodedData = null;
  }

  _decode() {
    if (this._encodedData) {
      this._decodedData = this._codec.decode(this._encodedData);
    } else {
      this._decodedData = new Uint8Array(0);
    }
  }

  _encode() {
    if (this._decodedData && this._decodedData.length > 0) {
      this._encodedData = this._codec.encode(this._encodedData);
    } else {
      this._encodedData = '';
    }
  }

  static parse(dataUrl) {
    const instance = new DataURL();
    instance.parse(dataUrl);
    return instance;
  }
}
