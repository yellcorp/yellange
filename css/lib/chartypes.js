export const WHITESPACE = {
  ' ': 1,
  '\f': 1,
  '\n': 1,
  '\r': 1,
  '\t': 1,
};

export const STRING_ENCLOSER = {
  '"': 1,
  "'": 1,
};

export const UNQUOTED_URL_TERMINATOR = {
  '"': 1,
  "'": 1,
  '(': 1,
  ')': 1,
  '\x7f': 1,
};
