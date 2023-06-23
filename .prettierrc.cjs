module.exports = {
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  tabWidth: 2,
  printWidth: 80,
  overrides: [
    {
      files: ['*.yml'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.json'],
      options: {
        singleQuote: false,
        quoteProps: 'preserve',
      },
    },
  ],
};
