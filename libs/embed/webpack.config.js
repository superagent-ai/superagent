const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'web.js',
    library: 'Superagent',
    libraryTarget: 'umd',
    libraryExport: 'init',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './'),
    },
    compress: true,
    port: 9000,
    open: 'index.html',
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/test.html' }, // Redirect root requests to test.html
        { from: /^\/index.html$/, to: '/test.html' }, // Optional: also redirect explicit index.html requests
      ],
    },
  }
};
