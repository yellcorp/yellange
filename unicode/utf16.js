const MAX_ARG_COUNT = 1024;

/**
 * @param {number[]} u16Array
 * @return {string}
 */
export function utf16Decode(u16Array) {
  if (u16Array.length < MAX_ARG_COUNT) {
    return String.fromCharCode(...u16Array);
  }

  let string = '';
  for (let i = 0; i < u16Array.length; i++) {
    string += String.fromCharCode(u16Array[i]);
  }
  return string;
}

/**
 * @param {string} string
 * @return {number[]}
 */
export function utf16Encode(string) {
  const array = [];
  for (let i = 0; i < string.length; i++) {
    array.push(string.charCodeAt(i));
  }
  return array;
}
