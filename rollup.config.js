import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { dts } from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import pg from './package.json';

export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: pg.main,
				format: 'cjs',
			},
			{
				file: pg.module,
				format: 'es',
			},
			{
				name: 'ElementUIValidator',
				file: pg.browser,
				format: 'umd',
			},
		],
		plugins: [
			typescript({ tsconfig: 'tsconfig.json' }),
			nodeResolve(),
			commonjs({ extensions: ['.js', '.ts'] }),
			terser(),
		],
	},
	{
		input: 'src/index.ts',
		output: {
			file: pg.types,
			format: 'es',
		},
		plugins: [dts({ compilerOptions: { declaration: true } })],
	},
];
