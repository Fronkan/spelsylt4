const path = require('path');
const OUTPUT_DIR = 'dist';
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  entry: {
    app: './src/enemyeditor.ts'
  },
  mode: 'development',
  devtool: 'inline-source-map',

  plugins:[ 
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "plugins","**","*"),
        to: path.resolve(__dirname, OUTPUT_DIR)
      }
  ])],

  devServer: {
      contentBase: path.resolve(__dirname, OUTPUT_DIR),
      https: false,
      port: 8081,
  }
})