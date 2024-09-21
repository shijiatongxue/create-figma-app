import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import RefreshPlugin from '@rspack/plugin-react-refresh';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';
// 需要换成自己的 CDN 地址
const CDN_ADDRESS =
  'https://pluin-1307850796.cos.ap-nanjing.myqcloud.com/template';
const templatePath = isDev
  ? `http://localhost:3000/index.html`
  : `${CDN_ADDRESS}/index.html`;

export default defineConfig({
  context: __dirname,
  entry: {
    index: './src/react/index.tsx',
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, 'dist/web'),
    publicPath: isDev ? '/' : CDN_ADDRESS,
    filename: '[name].[contenthash].js',
    cssFilename: '[name].[contenthash].css',
    hashDigestLength: 8,
    assetModuleFilename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
  },
  optimization: {
    minimize: !isDev,
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
        test: /sandbox\.js/,
        type: 'asset/resource',
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
                targets: [
                  'chrome >= 87',
                  'edge >= 88',
                  'firefox >= 78',
                  'safari >= 14',
                ],
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
    devMiddleware: {
      writeToDisk: true,
    },
    headers: {
      'access-control-allow-origin': '*',
    },
  },
  plugins: [
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.HtmlRspackPlugin({
      template: './src/react/index.html',
    }),
    new rspack.HtmlRspackPlugin({
      templateContent: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <script>
      window.location.href = '${templatePath}';
    </script>
  </body>
</html>`,
      chunks: [],
      filename: path.resolve(__dirname, './dist/ui.html'),
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: './manifest.json',
          to: path.resolve(__dirname, 'dist/manifest.json'),
        },
      ],
    }),
    isDev
      ? new RefreshPlugin({
          // sandbox 不需要注入 react-refresh
          exclude: /sandbox\.js/,
        })
      : null,
  ].filter(Boolean),
  experiments: {
    css: true,
  },
});
