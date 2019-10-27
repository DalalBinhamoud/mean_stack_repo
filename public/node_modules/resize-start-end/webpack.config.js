const resolve = require('path').resolve

module.exports = {
  entry: './index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'resize-start-end.js',
    library: 'resizeStartEnd',
    libraryTarget: 'umd'
  },
  externals: {
    debounce: {
      commonjs: 'lodash.debounce',
      commonjs2: 'lodash.debounce',
      amd: 'lodash.debounce',
      root: 'debounce'
    },
    mitt: {
      commonjs: 'mitt',
      commonjs2: 'mitt',
      amd: 'mitt',
      root: 'mitt'
    }
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: [
          resolve(__dirname, 'node_modules'),
          resolve(__dirname, 'demo')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: 'es2015'
          }
        }
      }
    ]
  }
}
