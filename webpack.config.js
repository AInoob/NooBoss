var path=require('path');
module.exports={
  entry: './pre/NooBoss.jsx',
  output: {
    path: 'js',
    filename: 'nooboss.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react']
        }
      }
    ]
  }
}
