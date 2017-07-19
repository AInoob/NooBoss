const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports={
  entry: {
    nooboss: './src/popup/NooBoss.jsx',
    background: './src/background/background.js',
  },
  output: {
    path: 'dist',
    filename: 'js/[name].js'
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
    }),
		new CopyWebpackPlugin([
			{ from: './src/options.html'},
			{ from: './src/popup/popup.html' },
			{ from: './src/js/util.js', to: './js' },
			{ from: './src/js/options.js', to: './js' },
			{ from: './src/js/hi.js', to: './js' },
		])
  ]
}
