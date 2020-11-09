const { join, resolve, sep } = require('path');
const { readdirSync } = require('fs');

function isTestFile(name) {
  return name && name[0] !== '.' && /\.test\.js$/.test(name);
}

function enumerateTests(root) {
  const paths = [];
  const q = [root];

  while (q.length > 0) {
    const dir = q.shift();
    const entries = readdirSync(dir, { withFileTypes: true });
    for (let entry of entries) {
      if (!entry.isSymbolicLink()) {
        const entryPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          q.push(entryPath);
        } else if (entry.isFile()) {
          if (isTestFile(entry.name)) {
            paths.push('.' + sep + entryPath);
          }
        }
      }
    }
  }
  return paths;
}

const inputFiles = enumerateTests('test');

console.log({ inputFiles });

module.exports = {
  entry: inputFiles,
  output: {
    filename: 'unit-tests.js',
    path: resolve(__dirname, 'bundle'),
  },
};
