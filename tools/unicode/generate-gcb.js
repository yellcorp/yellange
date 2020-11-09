'use strict';

const fs = require('fs');
const path = require('path');

const { DIR_UNICODE_LIB, DIR_DATA_EXTERNAL } = require('./dirs');

const WordWrapper = require('./lib/WordWrapper');
const fillCodeTemplate = require('./lib/fillCodeTemplate');
const packRle = require('./lib/compress/packRle');
const unidata = require('./lib/unidata');

const CONFIG = {
  dataPath: path.resolve(DIR_DATA_EXTERNAL, 'GraphemeBreakProperty.txt'),
  templatePath: path.resolve(DIR_UNICODE_LIB, 'templates', 'gcb.template.js'),
  outputPath: path.resolve(DIR_UNICODE_LIB, 'gcb.js'),
  constNamePattern: 'GCB_{}',
  indent: '  ',
  wrap: 120,
};

function allEqual(array, query) {
  const len = array.length;
  for (let i = 0; i < len; i++) {
    if (array[i] !== query) {
      return false;
    }
  }
  return true;
}

function stripeKey(stripe) {
  return Buffer.from(stripe).toString('base64');
}

/**
 * Formats an uncompressed codepoint->byte lookup as a 2-phase table.
 * returns [ planeLookups, stripes ]
 *
 * planeLookups[planeIndex] = [ stripeIndex, stripeIndex ... ]
 * stripes[stripeIndex] = [ value for base + 0, value for base + 1 ... ]
 *
 * To look up the value associated with c:
 *
 * planeIndex = c >> 16
 * planeLookup = planeLookups[planeIndex]
 *
 * indexInPlane = c & 0xFFFF
 * stripeIndex = planeLookup[indexInPlane >> 8]
 *
 * return stripes[stripeIndex][indexInPlane & 0xFF]
 *
 * OR, if stripes is flat
 * return stripes[(stripeIndex << 8) | (indexInPlane & 0xFF)]
 */
function buildTable(byteArray) {
  const PLANE_SIZE = 0x10000;
  const stripeSize = 0x100;

  const numberToStripe = [];
  const stripeToNumber = {};

  const planeStripeNumbers = [];

  for (
    let planeBase = 0;
    planeBase < byteArray.length;
    planeBase += PLANE_SIZE
  ) {
    const planeIndex = planeBase >> 16;
    const stripeNumbers = [];
    planeStripeNumbers.push(stripeNumbers);

    const plane = byteArray.subarray(planeBase, planeBase + PLANE_SIZE);
    if (allEqual(plane, 0)) {
      continue;
    }

    for (
      let stripeBase = 0;
      stripeBase < PLANE_SIZE;
      stripeBase += stripeSize
    ) {
      const stripe = plane.subarray(stripeBase, stripeBase + stripeSize);
      const key = stripeKey(stripe);

      if (!Object.prototype.hasOwnProperty.call(stripeToNumber, key)) {
        stripeToNumber[key] = numberToStripe.length;
        numberToStripe.push(stripe);
      }

      stripeNumbers.push(stripeToNumber[key]);
    }
  }

  return [planeStripeNumbers, numberToStripe];
}

function flattenByteArrays(arrays) {
  let size = 0;
  for (const a of arrays) {
    size += a.length;
  }

  let offset = 0;
  const flat = new Uint8Array(size);
  for (const a of arrays) {
    flat.set(a, offset);
    offset += a.length;
  }

  return flat;
}

function delimiter(str) {
  let first = true;
  return () => {
    if (first) {
      first = false;
      return '';
    }
    return str;
  };
}

function codegenStripes(stripes, writer) {
  writer.clear();

  const flat = flattenByteArrays(stripes);

  const comma = delimiter(', ');
  for (const n of packRle(flat)) {
    writer.write(comma()).write(n);
  }

  return '[\n' + writer.toString() + '\n]';
}

function codegenPlanes(planes, writer) {
  writer.clear();

  const groupComma = delimiter(', ');
  for (const plane of planes) {
    writer.write(groupComma());

    const elementComma = delimiter(', ');
    if (plane.length > 0) {
      writer.write('[ ');
      for (const n of packRle(plane)) {
        writer.write(elementComma()).write(n);
      }
      writer.write(' ]');
    } else {
      writer.write('null');
    }
  }

  return '[\n' + writer.toString() + '\n]';
}

function codegenConsts(names, namePattern) {
  return names
    .map(
      (name, index) =>
        'const ' + namePattern.replace('{}', name) + ' = ' + index + ';'
    )
    .join('\n');
}

function doIt(config) {
  const {
    dataPath,
    templatePath,
    outputPath,
    constNamePattern,
    indent,
    wrap,
  } = config;

  const writer = new WordWrapper(wrap, indent);

  const readStream = fs.createReadStream(dataPath, { encoding: 'utf8' });

  return Promise.all([
    unidata.parseEnumDataStream(readStream, 'Other'),
    fs.promises.readFile(templatePath, { encoding: 'utf8' }),
  ]).then(([parse, template]) => {
    parse.enum.addName('EOT');
    const [planes, stripes] = buildTable(parse.values);

    const subs = {
      stripesRle: codegenStripes(stripes, writer),
      planesRle: codegenPlanes(planes, writer),
      consts: codegenConsts(parse.enum.getNames(), constNamePattern),
    };

    return fs.promises.writeFile(outputPath, fillCodeTemplate(template, subs));
  });
}

function main() {
  doIt(CONFIG).then(null, (err) => {
    console.error(err);
    process.exitCode = 2;
  });
}

main();
