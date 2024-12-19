const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    content: './src/content.tsx',
    popup: './src/popup.tsx',
    background: './src/background.ts',
    'popup-inject': './src/popup-inject.tsx',
    vocabulary: './src/vocabulary.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'styled-components': path.resolve('./node_modules/styled-components'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/popup.html', '**/vocabulary.html']
          }
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './public/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      template: './public/vocabulary.html',
      filename: 'vocabulary.html',
      chunks: ['vocabulary'],
      inject: 'body'
    })
  ],
}; 