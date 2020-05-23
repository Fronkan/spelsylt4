const path = require('path');
const OUTPUT_DIR = 'dist';
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',

  devServer: {
      contentBase: path.resolve(__dirname, OUTPUT_DIR),
      https: false
  }
})