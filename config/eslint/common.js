module.exports = {
  rules: {
    // Possible errors
    'no-cond-assign': ['error', 'except-parens'],
    'no-template-curly-in-string': 'error',

    // Best practices
    'accessor-pairs': 'error',
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'class-methods-use-this': 'warn',
    'consistent-return': 'error',
    curly: ['error', 'multi-or-nest'],
    'dot-notation': 'warn',
    eqeqeq: ['error', 'always', { null: 'never' }],
    'grouped-accessor-pairs': 'error',
    'guard-for-in': 'error',
    'no-alert': 'error',
    'no-caller': 'error',
    'no-case-declarations': 'error',
    'no-constructor-return': 'error',
    'no-div-regex': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-floating-decimal': 'warn',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-multi-spaces': 'warn',
    'no-multi-str': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-proto': 'error',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'no-void': 'error',
    'no-warning-comments': 'warn',
    'no-with': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-regex-literals': 'error',
    radix: 'error',
    'require-await': 'error',
    'wrap-iife': 'error',
    yoda: ['error', 'never', { exceptRange: true }],

    // Strict mode
    strict: ['error', 'safe'],

    // Variables
    'no-label-var': 'error',
    'no-shadow': 'error',
    'no-use-before-define': 'error',

    // Sylistic issues
    // (ones not corrected by Prettier)
    'func-name-matching': ['error', 'always'],
    'max-len': [
      'warn',
      {
        code: 400, // let Prettier handle this
        comments: 79, // though Prettier mostly ignores comments
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
      },
    ],
    'new-cap': ['error', { capIsNew: true, newIsCap: true }],
    'new-parens': 'error',
    'no-array-constructor': 'error',
    'no-lonely-if': 'error',
    'no-mixed-operators': [
      'warn',
      {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
        ],
      },
    ],

    'no-new-object': 'error',
    'no-unneeded-ternary': 'error',
    'operator-assignment': ['warn', 'always'],
    semi: ['error', 'always'],
    'spaced-comment': ['warn', 'always', { markers: ['*'] }],
    'unicode-bom': ['error', 'never'],

    // ECMAScript 6

    'arrow-body-style': ['warn', 'as-needed'],
    'no-confusing-arrow': ['warn', { allowParens: true }],
    'no-duplicate-imports': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'warn',
    'no-var': 'error',
    'object-shorthand': ['warn', 'always', { avoidExplicitReturnArrows: true }],
    'prefer-arrow-callback': 'warn',
    'prefer-const': [
      'warn',
      { destructuring: 'all', ignoreReadBeforeAssign: false },
    ],
    'prefer-numeric-literals': 'warn',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'symbol-description': 'warn',
  },
};
