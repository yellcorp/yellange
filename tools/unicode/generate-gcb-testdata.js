'use strict';

const fs = require('fs');
const path = require('path');

const { DIR_UNICODE_TEST, DIR_DATA_EXTERNAL } = require('./dirs');
const eachStreamLine = require('./lib/eachStreamLine');
const normalizeLine = require('./lib/unidata').normalizeLine;

const CONFIG = {
  dataPath: path.resolve(DIR_DATA_EXTERNAL, 'GraphemeBreakTest.txt'),
  outputPath: path.resolve(DIR_UNICODE_TEST, '_gcb-test-data.js'),
  indent: '  ',
  wrap: 120,
};

function readGCBTestData(stream) {
  const tests = [];
  let lineNum = 0;

  return eachStreamLine(stream, (line) => {
    lineNum++;
    const nline = normalizeLine(line);
    if (!nline) {
      return;
    }

    const codepoints = [];
    const groupedCodepoints = [];

    const clusterGroupText = nline.split('÷');

    if (!clusterGroupText[0]) {
      clusterGroupText.shift();
    }

    if (!clusterGroupText[clusterGroupText.length - 1]) {
      clusterGroupText.pop();
    }

    clusterGroupText.forEach((group) => {
      const clusterCodes = group.split('×').map((c) => parseInt(c.trim(), 16));
      codepoints.push(...clusterCodes);
      groupedCodepoints.push(clusterCodes);
    });

    tests.push([lineNum, codepoints, groupedCodepoints]);
  }).then(() => tests);
}

function pad4(s) {
  if (s.length < 4) {
    return ('000' + s).slice(-4);
  } else {
    return s;
  }
}

function serializeTest(object, level, out) {
  if (Array.isArray(object)) {
    out.push('[');
    if (level === 0) {
      out.push('\n');
    }
    for (let i = 0; i < object.length; i++) {
      if (i > 0) {
        out.push(', ');
        if (level === 0) {
          out.push('\n');
        }
      }
      serializeTest(object[i], level + 1, out);
    }
    if (level === 0) {
      out.push('\n');
    }
    out.push(']');
  } else if (typeof object === 'number') {
    if (level === 2) {
      out.push(object.toString());
    } else {
      out.push('0x' + pad4(object.toString(16)));
    }
  } else {
    out.push(JSON.stringify(object));
  }
}

function serializeTests(tests) {
  const buf = [];
  serializeTest(tests, 0, buf);
  return buf.join('');
}

function doIt(config) {
  const { dataPath, outputPath } = config;

  const readStream = fs.createReadStream(dataPath, { encoding: 'utf8' });

  return readGCBTestData(readStream).then((tests) => {
    const code = [
      '// prettier-ignore',
      `export const testData = ${serializeTests(tests)};`,
      '',
    ].join('\n');

    return fs.promises.writeFile(outputPath, code);
  });
}

function main() {
  doIt(CONFIG).then(null, (err) => {
    console.error(err);
    process.exitCode = 2;
  });
}

main();
