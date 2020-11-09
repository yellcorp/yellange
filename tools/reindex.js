const { dirname, resolve } = require('path');
const fs = require('fs');

const TOOLS = __dirname;
const ROOT = dirname(TOOLS);
const INDEX_JS = 'index.js';

const FILE_INCLUDE = /\.js$/;
const FILE_EXCLUDE = /\.config\.js$/;

function includeFile(filename) {
  return (
    filename[0] !== '.' &&
    FILE_INCLUDE.test(filename) &&
    !FILE_EXCLUDE.test(filename)
  );
}

function canRead(path) {
  return fs.promises.access(path, fs.constants.R_OK).then(
    () => true,
    () => false
  );
}

function exportLine(identifier) {
  const path = `./${identifier}`;
  return `export * as ${identifier} from ${JSON.stringify(path)};`;
}

async function main() {
  const indexLines = [];

  const outPath = resolve(ROOT, INDEX_JS);
  const entries = await fs.promises.readdir(ROOT, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      const submoduleIndexPath = resolve(ROOT, entry.name, INDEX_JS);
      if (await canRead(submoduleIndexPath)) {
        indexLines.push(exportLine(entry.name));
      }
    } else if (entry.isFile()) {
      if (includeFile(entry.name)) {
        if (entry.name !== INDEX_JS) {
          const bareName = entry.name.slice(0, -3);
          indexLines.push(exportLine(bareName));
        }
      }
    }
  }

  indexLines.sort();
  indexLines.push(''); // blank line at the end
  await fs.promises.writeFile(outPath, indexLines.join('\n'), {
    encoding: 'utf8',
  });
}

main().then(null, (error) => {
  console.error(error);
  process.exitCode = 2;
});
