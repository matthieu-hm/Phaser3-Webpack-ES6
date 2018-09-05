var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var isProduction = (process.env.NODE_ENV === 'production') || false;

var srcPath = path.resolve(__dirname, 'src/');
var appPath = path.resolve(__dirname, 'src/app');
var outputPath = path.resolve(__dirname, 'dist/');

module.exports = {
  entry: {
    vendors: [
      'phaser',
    ],
    app: [
      'babel-polyfill',
      path.resolve(appPath, 'main.js')
    ],
  },
  devtool: 'cheap-source-map',
  output: {
    pathinfo: true,
    path: outputPath,
    filename: '[name].[chunkhash].js',
    library: '[name]',
    libraryTarget: 'umd',
    publicPath: ''
  },
  plugins: [
    new CleanWebpackPlugin([outputPath]),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Create global constants which can be configured at compile time
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(isProduction),
      WEBGL_RENDERER: JSON.stringify(true),
      CANVAS_RENDERER: JSON.stringify(true),
    }),
    // Creation of HTML files to serve your webpack bundles
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(srcPath, 'index.html'),
      minify: {
        removeAttributeQuotes: isProduction,
        collapseWhitespace: isProduction,
        html5: isProduction,
        minifyCSS: isProduction,
        minifyJS: isProduction,
        minifyURLs: isProduction,
        removeComments: isProduction,
        removeEmptyAttributes: isProduction
      },
      hash: false
    }),
    new CopyWebpackPlugin([
      { from: srcPath + '/assets', to: outputPath + '/assets' }
    ]),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: [outputPath]
      }
    })
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: [/\.vert$/, /\.frag$/], use: 'raw-loader' }
    ]
  },
  optimization: {
    minimize: isProduction
  },
}
