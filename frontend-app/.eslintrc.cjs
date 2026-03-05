module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  rules: {
    "max-lines": [
      "error",
      {
        max: 220,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
  },
};
