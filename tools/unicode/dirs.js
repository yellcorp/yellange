const { dirname, resolve } = require('path');

const DIR_TOOLS = dirname(__dirname);
const DIR_ROOT = dirname(DIR_TOOLS);
const DIR_TEST = resolve(DIR_ROOT, 'test');
const DIR_UNICODE_LIB = resolve(DIR_ROOT, 'unicode');
const DIR_UNICODE_TEST = resolve(DIR_TEST, 'unicode');

const DIR_DATA = resolve(__dirname, 'data');
const DIR_DATA_EXTERNAL = resolve(DIR_DATA, 'external');

module.exports = {
  DIR_TOOLS,
  DIR_ROOT,
  DIR_TEST,
  DIR_UNICODE_LIB,
  DIR_UNICODE_TEST,
  DIR_DATA,
  DIR_DATA_EXTERNAL,
};
