import sourcemaps from 'rollup-plugin-sourcemaps';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'js/index.js',
  sourceMap: true,
  moduleId: 'glidus',
  moduleName: 'Glidus',
  plugins: [
    sourcemaps(),
    nodeResolve({
      main: true,
      module: true,
      jsnext: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ],
  targets: [
    { dest: `dist/glidus.js`, format: 'umd' },
    { dest: `dist/glidus.es.js`, format: 'es' }
  ]
};
