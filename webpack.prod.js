const CompressionPlugin = require("compression-webpack-plugin")
const merge = require('webpack-merge');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new UglifyJSPlugin(),
    new CompressionPlugin({
      asset: "[path].gz",
      algorithm: "gzip",
      test: /\.(js|css)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ]
});
