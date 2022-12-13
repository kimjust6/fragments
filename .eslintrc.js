// .eslintrc.js

module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
    // https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
    jest: true,
  },
  extends: 'eslint:recommended',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {},
};
