module.exports = {
  parser: 'postcss-scss',
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
      },
    },
    stylelint: {
      fix: true,
    },
  },
};
