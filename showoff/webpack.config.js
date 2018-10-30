const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssExtractPlugin = require('mini-css-extract-plugin')
const { DefinePlugin, IgnorePlugin } = require('webpack')
const MicroversePlugin = require('microverse-webpack-plugin')

const mode = process.env.WEBPACK_SERVE
  ? 'development'
  : process.env.NODE_ENV || 'development'

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: ['babel-polyfill', 'subworkers', './index.js'],
  output: {
    path: path.join(__dirname, '.microverse'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  mode,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [CssExtractPlugin.loader, 'css-loader?modules'],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify(mode) } }),
    new IgnorePlugin(/microverse\.json/),
    new CssExtractPlugin({ filename: 'style.css' }),
    new MicroversePlugin({ config: path.join(__dirname, './microverse.json') }),
  ],
  node: {
    dgram: 'empty',
    net: 'empty',
    fs: 'empty',
  },
}
