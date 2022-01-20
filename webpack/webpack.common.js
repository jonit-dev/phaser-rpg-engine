const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: ['./src/game.ts', './webpack/credits.js'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [{ test: /\.tsx?$/, include: path.join(__dirname, '../src'), loader: 'ts-loader' }],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          filename: '[name].bundle.js',
        },
      },
    },
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({ gameName: 'My Phaser Game', template: 'src/index.html' }),
    new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets' },
      { from: 'pwa', to: '' },
      { from: 'src/favicon.ico', to: '' },
    ]),
    new InjectManifest({
      swSrc: path.resolve(__dirname, '../pwa/sw.js'),
    }),
  ],
};
