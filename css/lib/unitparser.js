const FLOAT_PATTERN = '-?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';

function numberUnitMatcher(units) {
  // assumes there are no unit suffixes that need regex escaping
  const unitRegex = units.join('|');
  return new RegExp(`^\\s*(${FLOAT_PATTERN})\\s*(${unitRegex})\\s*$`, 'i');
}

export function unitParser(unitFactors) {
  const regex = numberUnitMatcher(Object.keys(unitFactors));
  return (str) => {
    const match = regex.exec(str);
    if (match) {
      return parseFloat(match[1]) * unitFactors[match[2]];
    }
    return NaN;
  };
}
