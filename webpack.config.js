var path=require('path');
module.exports={
  entry: {
    nooboss: './pre/NooBoss.jsx',
    background: './pre/background.js',
  },
  output: {
    path: 'dist/js',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
}
