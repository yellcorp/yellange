'use strict';

const download = require('download');

const { DIR_DATA_EXTERNAL } = require('./dirs');

// Check GraphemeBreakTest before upgrading the version - I think newer GCB
// algorithms have more states, which would mean a rewrite of gcb.js.
const VERSION = '10.0.0';
const URLS = [
  `http://www.unicode.org/Public/${VERSION}/ucd/auxiliary/GraphemeBreakProperty.txt`,
  `http://www.unicode.org/Public/${VERSION}/ucd/auxiliary/GraphemeBreakTest.txt`,
];

function main() {
  return Promise.all(URLS.map((u) => download(u, DIR_DATA_EXTERNAL)));
}

main().then(null, (err) => {
  console.error(err);
  process.exitCode = 2;
});
