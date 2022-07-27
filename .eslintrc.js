module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "eol-last": "error",
    "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
    "no-trailing-spaces": "error",
  },
};
