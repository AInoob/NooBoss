const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports={
	cache: true,
  entry: {
    popup: './src/popup/index.js',
    background: './src/background/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
					cacheDirectory: true,
          presets: ['react', 'es2015'],
					plugins: [
						'babel-plugin-lodash',
						'transform-object-rest-spread',
						'transform-async-to-generator',
						'transform-es3-property-literals',
						['transform-runtime', {
							'helpers': false,
							'polyfill': false,
							'regenerator': true,
							'moduleName': 'babel-runtime'
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
			{ from: './src/popup/popup.html' },
			{ from: './src/manifest.json' },
			{ from: './src/images', to: 'images'  },
		])
  ]
}
