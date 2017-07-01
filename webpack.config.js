const webpack = require('webpack');
module.exports={
  entry: {
    nooboss: './pre/NooBoss.jsx',
    background: './pre/background/background.js',
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
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
