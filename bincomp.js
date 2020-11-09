/**
 * @file bincomp: Binary composite data
 *
 * Declare C-style structs and unions, and read or write them via DataViews.
 * Very loosely inspired by the structured data types in Python's
 * [`ctypes`](https://docs.python.org/3/library/ctypes.html#structured-data-types)
 * module.
 */

import { BytePrimitiveType, MultibytePrimitiveType } from './lib/bincomp/types';
import { Field } from './lib/bincomp/field';
import { getPrototypeMethodInfo } from './lib/internal/dataviewmeta';
import { memoize0 } from './memo';

const hasOwn = Object.prototype.hasOwnProperty;

function getOwn(obj, key) {
  if (hasOwn.call(obj, key)) {
    return obj[key];
  }
  return undefined;
}

const NO_PARENT = {};
export class Registry {
  constructor(parent = null) {
    if (parent === NO_PARENT) {
      this._parent = null;
    } else {
      this._parent = parent || getPrimitiveRegistry();
    }

    this._names = {};
  }

  newChild() {
    return new Registry(this);
  }

  get(name) {
    return (
      getOwn(this._names, name) ||
      (this._parent ? this._parent.get(name) : null)
    );
  }

  hasOwn(name) {
    return hasOwn.call(this._names, name);
  }

  has(name) {
    return this.hasOwn(name) || (this._parent ? this._parent.has(name) : false);
  }

  struct(name, spec) {
    // Registries create Structs/Unions, and Structs/Unions make use of
    // Registries, so...
    // eslint-disable-next-line no-use-before-define
    return this.add(new Struct(name, spec, this));
  }

  union(name, spec) {
    // eslint-disable-next-line no-use-before-define
    return this.add(new Union(name, spec, this));
  }

  add(type) {
    if (this.hasOwn(type.name)) {
      throw new Error(
        `Registry already contains a type with the name '${type.name}'`
      );
    }
    this._names[type.name] = type;
    return this;
  }
}

export const getPrimitiveRegistry = memoize0(() => {
  const registry = new Registry(NO_PARENT);
  for (const method of getPrototypeMethodInfo()) {
    const name = method.suffix.toLowerCase();

    registry.add(
      method.size === 1
        ? new BytePrimitiveType(name, method.getter, method.setter)
        : new MultibytePrimitiveType(
            name,
            method.getter,
            method.setter,
            method.size
          )
    );

    // `char` is the same as uint8, but special-cased to deserialize to a
    // string when array notation is used. utf-8 encoding is assumed.
    if (name === 'uint8') {
      registry.add(new BytePrimitiveType('char', method.getter, method.setter));
    }
  }

  return registry;
});

// methods in Composite and co are overriden to swap out implementations rather
// than work with the object's state.
/* eslint-disable class-methods-use-this */
class Composite {
  constructor(name, spec, registry = null) {
    if (!registry) {
      registry = getPrimitiveRegistry();
    }

    this.name = name;
    this._fields = [];
    this._fieldsByName = {};
    this._parseSpec(spec, registry);

    let size = 0;
    for (const field of this._fields) {
      size = this._accumulateFieldSize(size, field);
    }
    this.size = size;
  }

  unpack(dataView, offset, littleEndian) {
    const result = {};
    for (const field of this._fields) {
      result[field.name] = field.type.unpack(
        dataView,
        offset + field.offset,
        littleEndian
      );
    }
    return result;
  }

  _nextOffset(_field) {
    throw new Error('Abstract method');
  }

  _accumulateFieldSize(_accSize, _field) {
    throw new Error('Abstract method');
  }

  _parseSpec(fieldSpecs, registry) {
    const fields = this._fields;
    const fieldsByName = this._fieldsByName;

    let offset = 0;
    for (const fieldSpec of fieldSpecs) {
      const field = Field.parse(fieldSpec, registry, offset);

      if (fieldsByName[field.name] instanceof Field) {
        throw new Error(`Repeated field name: '${field.name}'`);
      }

      fields.push(field);
      fieldsByName[field.name] = field;
      offset = this._nextOffset(field);
    }
  }
}

export class Struct extends Composite {
  pack(dataView, offset, value, littleEndian) {
    for (const field of this._fields) {
      field.type.pack(
        dataView,
        offset + field.offset,
        value[field.name],
        littleEndian
      );
    }
  }

  _nextOffset(field) {
    return field.offset + field.type.size;
  }

  _accumulateFieldSize(accSize, field) {
    return accSize + field.type.size;
  }
}

export class Union extends Composite {
  pack(dataView, offset, value, littleEndian) {
    const keys = Object.keys(value);
    if (keys.length !== 1) {
      throw new Error(
        'Union.pack requires an object with exactly one property'
      );
    }

    const field = this._fieldsByName[keys[0]];
    if (!field) {
      // the single property wasn't a known field name.  as of now this isn't
      // an error condition in order to mirror the behavior of Struct, where
      // it's not an error condition for an object to include unrecognized
      // field names.
      return;
    }

    field.type.pack(
      dataView,
      offset + field.offset,
      value[field.name],
      littleEndian
    );

    // if this field is less than the total union length, zero out the rest
    for (let z = field.type.size; z < this.size; z++) {
      dataView.setUint8(offset + z, 0);
    }
  }

  _nextOffset(field) {
    return field.offset;
  }

  _accumulateFieldSize(accSize, field) {
    return Math.max(accSize, field.type.size);
  }
}

// helper function for use with Union.pack
export function only(object, singlePropertyName) {
  return {
    [singlePropertyName]: object[singlePropertyName],
  };
}
