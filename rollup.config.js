import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import nodePolyFills from 'rollup-plugin-node-polyfills';
import json from '@rollup/plugin-json'
// import babel from 'rollup-plugin-babel'
// import amd from 'rollup-plugin-amd';
import { visualizer } from 'rollup-plugin-visualizer'
import analyze from 'rollup-plugin-analyzer'


export default {
	input: 'index.js',
	output: {
		dir: 'output',
		format: 'cjs',
		exports: 'default',
		name: 'should-skip-update',
		globals: {'fs': 'fs', 'assert': 'assert', 'util': 'util', 'path': 'path'}
	},
	plugins: [
		commonjs({
			transformMixedEsModules: true,
			dynamicRequireTargets: [
				// 'lib/rules/*.js',
				'node_modules/jsx-ast-utils/lib/values/expressions/*.js',
				// 'node_modules/react/index.js'
			],
			ignoreDynamicRequires: [
				'node_modules/react/index.js'
			]
		}),
		// babel({
		// 	exclude: 'node_modules/**',
		// }),
		// nodePolyFills(),
		nodeResolve({
			moduleDirectories: ['node_modules'],
		}),
		json(),
		// visualizer(),
		analyze({ summaryOnly: true }),
	],
	external: ['fs', 'assert', 'util', 'path']
};
