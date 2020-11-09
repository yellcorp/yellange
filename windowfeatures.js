/**
 * @file windowfeatures
 *
 * You know `window.open()`? Remember the `strWindowFeatures` parameter?  The
 * one on
 * [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Window_features)
 * with all the Windows XP screenshots and Netscape icons? Ever wanted to parse
 * them to and from mapping objects? No? Just me?
 *
 * 2020 update: RIP to the [Windows XP screenshots and Netscape
 * icons](https://web.archive.org/web/20200315001129/https://developer.mozilla.org/en-US/docs/Web/API/Window/open),
 * finally deleted March 25, 2020
 */

const hasOwn = Object.prototype.hasOwnProperty;

const integer = {
  parse(n) {
    return n | 0;
  },
  format(n) {
    return String(n | 0);
  },
};

const BOOL_STRINGS = {
  false: false,
  no: false,
  0: false,
  true: true,
  yes: true,
  1: true,
};
const bool = {
  parse(b) {
    return BOOL_STRINGS[String(b).toLowerCase()] || Boolean(b);
  },

  format(b) {
    return b ? 'yes' : 'no';
  },
};

const schema = {
  left: integer,
  top: integer,
  width: integer,
  height: integer,
  screenX: integer,
  screenY: integer,
  centerscreen: bool,
  outerHeight: integer,
  outerWidth: integer,
  innerHeight: integer,
  innerWidth: integer,
  menubar: bool,
  toolbar: bool,
  location: bool,
  personalbar: bool,
  directories: bool,
  status: bool,
  dependent: bool,
  minimizable: bool,
  fullscreen: bool,
  noopener: bool,
  resizable: bool,
  scrollbars: bool,
  chrome: bool,
  dialog: bool,
  modal: bool,
  titlebar: bool,
  alwaysRaised: bool,
  alwaysLowered: bool,
  'z-lock': bool,
  close: bool,
};

export function formatWindowFeatures(featureMap) {
  if (!featureMap) {
    return '';
  }

  const stringPairs = [];
  for (const key in featureMap) {
    if (hasOwn.call(featureMap, key)) {
      const value = featureMap[key];
      let pair = key + '=';
      if (hasOwn.call(schema, key)) {
        pair += schema[key].format(value);
      } else {
        pair += String(value);
      }
      stringPairs.push(pair);
    }
  }
  return stringPairs.join(',');
}

export function parseWindowFeatures(featureString) {
  const map = {};
  const pairs = featureString.split(',');
  for (let i = 0; i < pairs.length; i++) {
    const [key, delim, value] = partition(pairs[i], '=');
    if (delim) {
      if (hasOwn.call(schema, key)) {
        map[key] = schema[key].parse(value);
      } else {
        map[key] = value;
      }
    } else {
      map[key] = true;
    }
  }
  return map;
}
