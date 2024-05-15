const { join } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    popup: join(__dirname, 'dist', 'src', 'popup.js'),
    background: join(__dirname, 'dist', 'src', 'background.js')
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
      patterns: [{ from: './assets/manifest.json' }]
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './dist/src/IIFE/getAudioViaWebRTC.js' }]
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, 'assets', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, 'assets', 'background.html'),
      filename: 'background.html',
      chunks: ['background']
    }),
    new MiniCssExtractPlugin(),
    new WriteFilePlugin()
  ]
}
