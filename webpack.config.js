const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports={
  entry: {
    popup: './src/popup/index.js',
    background: './src/background/index.js',
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
          presets: ['react', 'es2015'],
					plugins: [
						'transform-object-rest-spread',
						'transform-async-to-generator',
						["transform-runtime", {
							"helpers": false,
							"polyfill": false,
							"regenerator": true,
							"moduleName": "babel-runtime"
						}],
					]
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
		])
  ]
}
