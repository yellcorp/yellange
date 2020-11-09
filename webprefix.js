/**
 * @file webprefix: In-browser vendor prefix discovery.
 */

import { memoize0, memoize1 } from './memo';

const API_PROPERTY_PREFIXES = ['o', 'ms', 'moz', 'webkit'];
const API_INTERFACE_PREFIXES = ['O', 'MS', 'Moz', 'Webkit'];
const CSS_PROPERTY_PREFIXES = ['-o-', '-ms-', '-moz-', '-webkit-'];

const NOT_PREFIXED = -1;
const UNKNOWN = -2;

function findPrefixIndex(
  prefixList,
  object,
  canonicalPropName,
  prependedPropName
) {
  if (object[canonicalPropName] !== undefined) {
    return NOT_PREFIXED;
  }

  for (let i = 0; i < prefixList.length; i++) {
    const prefixedProp = prefixList[i] + prependedPropName;
    if (object[prefixedProp] !== undefined) {
      return i;
    }
  }

  return UNKNOWN;
}

function findPrefix(prefixList, object, canonicalPropName, prependedPropName) {
  const index = findPrefixIndex(
    prefixList,
    object,
    canonicalPropName,
    prependedPropName
  );
  switch (index) {
    case UNKNOWN:
      return null;
    case NOT_PREFIXED:
      return canonicalPropName;
    default:
      return prefixList[index] + prependedPropName;
  }
}

function capFirst(s) {
  return s.charAt(0).toUpperCase() + s.substr(1);
}

const getSampleElement = memoize0(() => document.createElement('div'));

const findPrefixedStyleProperties = memoize1((plainPropertyName) => {
  const capped = capFirst(plainPropertyName);
  const index = findPrefixIndex(
    API_PROPERTY_PREFIXES,
    getSampleElement().style,
    plainPropertyName,
    capped
  );

  let result;
  switch (index) {
    case UNKNOWN:
      result = [null, null];
      break;
    case NOT_PREFIXED:
      result = [plainPropertyName, plainPropertyName];
      break;
    default:
      result = [
        API_PROPERTY_PREFIXES[index] + capped,
        CSS_PROPERTY_PREFIXES[index] + plainPropertyName,
      ];
      break;
  }

  return result;
});

export function findCssProperty(plainPropertyName) {
  return findPrefixedStyleProperties(plainPropertyName)[1];
}

export function findInterface(object, plainPropertyName) {
  return findPrefix(
    API_INTERFACE_PREFIXES,
    object || window,
    plainPropertyName,
    plainPropertyName
  );
}

export function findObjectProperty(object, plainPropertyName) {
  return findPrefix(
    API_PROPERTY_PREFIXES,
    object,
    plainPropertyName,
    capFirst(plainPropertyName)
  );
}

export function findStyleProperty(plainPropertyName) {
  return findPrefixedStyleProperties(plainPropertyName)[0];
}
