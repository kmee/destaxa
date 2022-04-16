module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "script",
  },
  rules: {
    "no-unused-vars": "off",
    "no-undef": "off",
  },
};
