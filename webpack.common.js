const path = require('path');

module.exports = {
  entry: {
    index: './view/pages/root/index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, './static/'),
    publicPath: '/static/',
  }
};
