import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {babel} from '@rollup/plugin-babel';
// import { visualizer } from 'rollup-plugin-visualizer'
// import analyze from 'rollup-plugin-analyzer'

export default {
  input: 'index.js',
  output: {
    dir: 'dist',
    format: 'cjs',
    exports: 'default',
    name: 'should-skip-update',
    globals: {
      fs: 'fs', assert: 'assert', util: 'util', path: 'path'
    }
  },
  plugins: [
    commonjs({
      transformMixedEsModules: true,
      dynamicRequireTargets: [
        'node_modules/jsx-ast-utils/lib/values/expressions/*.js'
      ],
      ignoreDynamicRequires: [
        'node_modules/react/index.js'
      ]
    }),
    nodeResolve({
      moduleDirectories: ['node_modules']
    }),
    babel({babelHelpers: 'bundled'}),
    json()
    // visualizer(),
    // analyze({ summaryOnly: true }),
  ],
  external: ['fs', 'assert', 'util', 'path']
};
