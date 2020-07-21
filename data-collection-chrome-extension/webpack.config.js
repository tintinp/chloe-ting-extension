const { join } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    popup: join(__dirname, 'src', 'js', 'popup.js'),
    background: join(__dirname, 'src', 'js', 'background.js')
  },
  output: {
    path: join(__dirname, 'build'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // instead of style-loader
          'css-loader'
        ]
      }
    ]
  },
  devServer: {
    disableHostCheck: true
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: './src/manifest.json' }]
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src', 'background.html'),
      filename: 'background.html',
      chunks: ['background']
    }),
    new MiniCssExtractPlugin(),
    new WriteFilePlugin()
  ]
}
