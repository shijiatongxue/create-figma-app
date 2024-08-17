import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import path from 'path';
import RefreshPlugin from '@rspack/plugin-react-refresh';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
	context: __dirname,
	entry: {
		index: './src/react/index.tsx',
		code: './src/sandbox/index.ts',
	},
	output: {
		clean: true,
		path: path.resolve(__dirname, 'dist/web'),
		filename: pathData => {
			return pathData?.chunk?.name === 'index' ? '[name].[contenthash].js' : '../[name].js';
		},
		publicPath: '/',
		cssFilename: '[name].[contenthash].css',
		hashDigestLength: 8
	},
	resolve: {
		extensions: ['...', '.ts', '.tsx', '.jsx'],
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: 'asset',
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: {
									tailwindcss: {},
									autoprefixer: {},
								},
							},
						},
					},
				],
				type: 'css',
			},
			{
				test: /\.(jsx?|tsx?)$/,
				use: [
					{
						loader: 'builtin:swc-loader',
						options: {
							jsc: {
								parser: {
									syntax: 'typescript',
									tsx: true,
								},
								transform: {
									react: {
										runtime: 'automatic',
										development: isDev,
										refresh: isDev,
									},
								},
							},
							env: {
								targets: ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'],
							},
						},
					},
				],
			},
		],
	},
	devtool: isDev ? 'eval' : false,
	devServer: {
		open: true,
		port: 3000,
	},
	plugins: [
		new rspack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),
		new rspack.ProgressPlugin({}),
		new rspack.HtmlRspackPlugin({
			template: './src/react/index.html',
			filename: 'index.html',
			chunks: ['index'],
		}),
		new rspack.CopyRspackPlugin({
			patterns: [
				{
					from: './manifest.json',
					to: path.resolve(__dirname, 'dist/manifest.json'),
				},
				{
					from: './ui.html',
					to: path.resolve(__dirname, 'dist/ui.html'),
				},
			]
		}),
		isDev ? new RefreshPlugin() : null,
	].filter(Boolean),
	experiments: {
		css: true,
	},
});
