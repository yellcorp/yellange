import { ArrayType, StringUTF8Type } from './types';

function parseArraySpec(nameSpec) {
  const parts = nameSpec.split('[');
  const name = parts[0];
  const arrayLengths = [];

  let charIndex = name.length + 1;
  for (let i = 1; i < parts.length; i++) {
    const match = /^(\d+)\]$/.exec(parts[i]);
    if (!match) {
      throw new Error(
        `Couldn't parse array length in '${nameSpec}' at character ${charIndex}`
      );
    }
    const number = parseInt(match[1], 10);
    if (number === 0) {
      throw new Error(
        `Invalid array length of 0 in '${nameSpec}' at character ${charIndex}`
      );
    }
    arrayLengths.push(number);
    charIndex += parts[i].length + 1;
  }

  return [name, arrayLengths];
}

function resolveArrayType(typeName, registry, arrayLengths) {
  let type = registry.get(typeName);

  if (!type) {
    throw new Error(`Unknown type name: '${typeName}'`);
  }

  let innermostDimension = true;
  for (let i = arrayLengths.length - 1; i >= 0; i--) {
    type = new ArrayType(type, arrayLengths[i]);
    if (innermostDimension && typeName === 'char') {
      type = new StringUTF8Type(type);
    }
    innermostDimension = false;
  }

  return type;
}

export class Field {
  constructor(name, type, offset) {
    this.name = name;
    this.type = type;
    this.offset = offset;
  }

  // parses a field specifier given as a 2-member array, in the format
  // [ "typeName", "fieldName([length])*" ]
  static parse(fieldSpec, registry, offset) {
    const [typeName, fieldNameSpec] = fieldSpec;
    const [name, arrayLengths] = parseArraySpec(fieldNameSpec);

    const type = resolveArrayType(typeName, registry, arrayLengths);

    return new Field(name, type, offset);
  }
}
