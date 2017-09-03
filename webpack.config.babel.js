import { resolve } from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
// import CleanWebpackPlugin from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'

export default {
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
     { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
     { test: /\.css$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] }
   ],
  },
  plugins: [
    // new ExtractTextPlugin('styles.css'),
    // new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new HardSourceWebpackPlugin({
      cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
      recordsPath: 'node_modules/.cache/hard-source/[confighash]/records.json',
      configHash: require('node-object-hash')({sort: false}).hash,
    })
  ]
}
