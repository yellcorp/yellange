'use strict';

const rle = require('./rle');

function packRle(array) {
  let maxValue = 1;
  const valueCounts = rle(array);

  for (let i = 0; i < valueCounts.length; i += 2) {
    if (valueCounts[i] > maxValue) {
      maxValue = valueCounts[i];
    }
  }

  const shift = Math.floor(Math.log(maxValue) * Math.LOG2E) + 1;

  const packed = [shift];
  for (let i = 0; i < valueCounts.length; i += 2) {
    packed.push(((valueCounts[i + 1] - 1) << shift) | valueCounts[i]);
  }

  return packed;
}

module.exports = packRle;
