// noinspection JSUnusedGlobalSymbols

import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/chuguan-strategy.ts',
  output: {
    clean: true,
    filename: 'chuguan-strategy.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};

export default config;
