const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  cache: true,
  entry: {
    background: './src/background/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/
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
      { from: './thirdParty', to: 'thirdParty'  },
    ])
  ],
  mode: 'production',
  optimization: {
    minimize: false
  }
}
