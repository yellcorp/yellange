'use strict';

const readline = require('readline');

function eachStreamLine(stream, lineHandler) {
  return new Promise((resolve, reject) => {
    const reader = readline.createInterface({
      input: stream,
    });

    let cleanup, onError, onEnd;

    cleanup = () => {
      stream.removeListener('error', onError);
      reader.removeAllListeners();
    };

    onError = (error) => {
      cleanup();
      reject(error);
    };

    stream.on('error', onError);
    reader.on('line', lineHandler).on('close', () => {
      cleanup();
      resolve();
    });
  });
}

module.exports = eachStreamLine;
