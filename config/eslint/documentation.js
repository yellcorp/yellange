module.exports = {
  rules: {
    'valid-jsdoc': 'warn',
    'require-jsdoc': [
      'warn',
      {
        ArrowFunctionExpression: false,
        ClassDeclaration: true,
        FunctionDeclaration: true,
        FunctionExpression: false,
        MethodDefinition: true,
      },
    ],
  },
};
