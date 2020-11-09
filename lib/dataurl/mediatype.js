import { partition } from '../../string';

const hasOwn = Object.prototype.hasOwnProperty;

export class MediaType {
  constructor(mediaTypeString) {
    this._mediaType = String(mediaTypeString || '');
    this._type = this._subtype = this._parameters = null;
  }

  get type() {
    if (this._type == null) {
      this._break();
    }
    return this._type;
  }

  set type(newType) {
    if (this._type == null) {
      this._break();
    }
    this._type = String(newType);
  }

  get subtype() {
    if (this._subtype == null) {
      this._break();
    }
    return this._subtype;
  }

  set subtype(newType) {
    if (this._subtype == null) {
      this._break();
    }
    this._subtype = String(newType);
  }

  get parameterNames() {
    if (this._parameters == null) {
      this._break();
    }
    return Object.keys(this._parameters);
  }

  get() {
    if (this._mediaType == null) {
      this._assemble();
    }
    return this._mediaType;
  }

  set(newMediaType) {
    this._mediaType = String(newMediaType);
    this._type = this._subtype = this._parameters = null;
  }

  hasParameter(attributeName) {
    if (this._parameters == null) {
      this._break();
    }
    return hasOwn.call(this._parameters, attributeName);
  }

  getParameter(attributeName) {
    return this.hasParameter(attributeName)
      ? this._parameters[attributeName]
      : undefined;
  }

  setParameter(attributeName, value) {
    if (this._parameters == null) {
      this._break();
    }
    this._parameters[attributeName] = String(value);
  }

  _break() {
    const parts = this._mediaType.split(';');
    const typeSubtype = partition(parts[0], '/');
    this._type = typeSubtype[0];
    this._subtype = typeSubtype[2];

    const params = (this._parameters = {});
    for (let i = 1; i < parts.length; i++) {
      const attrValue = partition(parts[i], '=');
      params[attrValue[0]] = decodeURIComponent(attrValue[2]);
    }

    this._mediaType = null;
  }

  _assemble() {
    const parts = [this._type];
    if (this._subtype) {
      parts[0] += '/' + this._subtype;
    }

    const attrs = Object.keys(this._parameters);
    for (let i = 0; i < attrs.length; i++) {
      parts.push(
        attrs[i] + '=' + encodeURIComponent(this._parameters[attrs[i]])
      );
    }

    this._type = this._subtype = this._parameters = null;

    this._mediaType = parts.join(';');
  }
}
MediaType.prototype.toString = MediaType.prototype.get;
