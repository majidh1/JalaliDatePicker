import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import createBanner from 'create-banner';
import nodeResolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

pkg.name = pkg.name.replace(/^.+\//, '');
const banner = createBanner({
  case: 'PascalCase',
  data: {
    year: '2020-present',
  },
});

module.exports = {
  input: 'src/index.js',
  output: [
    {
      banner,
      file: `dist/${pkg.name}.js`,
      format: 'umd',
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    babel(),
  ],
};
