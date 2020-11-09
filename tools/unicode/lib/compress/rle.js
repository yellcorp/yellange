'use strict';

function rle(array) {
  const valueCounts = [];

  let runningValue = NaN;
  let runningCount = 0;

  for (const value of array) {
    if (value === runningValue) {
      runningCount++;
    } else {
      if (runningCount > 0) {
        valueCounts.push(runningValue, runningCount);
      }
      runningValue = value;
      runningCount = 1;
    }
  }
  if (runningCount > 0) {
    valueCounts.push(runningValue, runningCount);
  }
  return valueCounts;
}

module.exports = rle;
