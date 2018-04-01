const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin')

module.exports = {
  devtool: "source-map",
  entry: ['./index.js'],
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss', '.gif', '.png', '.jpeg', '.svg']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: './dist/'
  },
  plugins: getPlugins(),
  module: {
    rules: [{
      test: /\.js(x)?$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }, {
      test: /\.s?css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('autoprefixer')()
            ]
          }
        }]
      })
    }, {
      test: /\.(gif|png|jpe?g|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '/'
          }
        }
      ]
    }]
  },
  stats: {
    children: false,
    chunk: false,
    chunkModules: false,
    modules: false
  }
}

// console.log(...([].concat.apply([], fs.readdirSync('./tpl').map(file => fs.statSync(path.join('./tpl', file)).isDirectory() ? fs.readdirSync(path.join('./tpl', file)).filter(htmlFilter).map(htmlWebpackPlugin(file)) : htmlWebpackPlugin(file)))))

function getPlugins () {
  return [].concat(
    htmlWebpackPlugin('index.html'), [
      new ExtractTextPlugin('main.css'),
      new FlowBabelWebpackPlugin({
        warn: true
      })
    ]
  )
}
function htmlWebpackPlugin (file) {
  return new HtmlWebpackPlugin({
    filename: path.join('../', file),
    template: path.join('!!html-loader!./', file), // html模板路径,模板路径是支持传参调用loader的,
    inject: true, // 打包之后的js插入的位置，true/'head'/'body'/false,
    hash: true,
    showErrors: false,
    minify: {
      removeComments: true,
      collapseWhitespace: false
    }
  })
}
