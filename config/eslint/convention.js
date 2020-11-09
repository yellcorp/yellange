module.exports = {
  rules: {
    'no-fallthrough': [
      'error',
      {
        commentPattern: '[Ff]alls?s?through',
      },
    ],

    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    'consistent-this': ['error', 'self'],

    'id-denylist': ['warn', 'cb', 'e', 'ev', 'err', 'data'],
  },
};
