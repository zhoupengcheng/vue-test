const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  assetsDir: "static",
  // webpack配置
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 清除css，js版本号
      config.output.filename('static/js/[name].js').end();
      config.output.chunkFilename('static/js/[name].js').end();
      // 为生产环境修改配置...
      config.plugin('extract-css').tap(args => [{
        filename: `static/css/[name].css`,
        chunkFilename: `static/css/[name].css`
      }])
    }
  },

  configureWebpack: (config) => {
    let plugins = [
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     warnings: false,
      //     compress: {
      //       drop_console: true,
      //       drop_debugger: true,
      //       pure_funcs: ['console.log'] // 移除console
      //     },
      //     output: {
      //       // 去掉注释内容
      //       comments: false
      //     }
      //   },
      //   sourceMap: false,
      //   parallel: true
      // }),
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css/,
        threshold: 10240,
        deleteOriginalAssets: false
      })
      // new HtmlWebpackPlugin({
      //   inject: 'body'
      // })
    ]
    // 只有打包生产环境才需要将console删除
    if (process.env.NODE_ENV === 'production') {
      config.plugins = [...config.plugins, ...plugins]
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: process.env.NODE_ENV === 'production',
    // 开启 CSS source maps?
    sourceMap: false,
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
    loaderOptions: {
      sass: {
        data: `@import "@/styles/variables.scss";`
      }
    }
  },
  // webpack-dev-server 相关配置
  devServer: {
    hot: true,
    open: true,
    port: 8080,
    https: false,
    proxy: {
      '/api': {
        target: 'https://devshdsyy.racdn.com',
        // target: 'https://ynxk.xinkangtong.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }, // 设置代理
    before: app => {}
  },
  lintOnSave: false
}