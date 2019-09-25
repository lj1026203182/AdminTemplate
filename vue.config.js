/*
 * @Description: 
 * @version: 
 * @Author: Lj
 * @Date: 2019-08-07 09:32:26
 * @LastEditors: Lj
 * @LastEditTime: 2019-09-05 09:50:11
 */
const isProduction = process.env.NODE_ENV === 'production'
// 本地环境是否需要使用cdn
const devNeedCdn = false

// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter'
  },
  // cdn的css链接
  css: [],
  // cdn的js链接
  js: [
    'https://cdn.staticfile.org/vue/2.6.10/vue.min.js',
    'https://cdn.staticfile.org/vuex/3.0.1/vuex.min.js',
    'https://cdn.staticfile.org/vue-router/3.0.3/vue-router.min.js'
  ]
}

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// 引入babel-polyfill
require('babel-polyfill')

module.exports = {
  // publicPath: '/home',
  lintOnSave: false,
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  transpileDependencies: [ // 指定对第三方依赖包进行babel-polyfill处理
    'iview', 'axios', 'tree-table-vue', 'wangeditor', 'v-viewer'
  ],
  chainWebpack: config => {
    // 解决ie11兼容ES6
    config.entry('main').add('babel-polyfill')

    // ============压缩图片 start============
    // 暂时性报错 找不到原因
    // config.module
    //   .rule('images')
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({ bypassOnDebug: true })
    //   .end()
    // ============压缩图片 end============

    config.plugins.delete('prefetch')

    // ============注入cdn start============
    config.plugin('html').tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn
      return args
    })
    // ============注入cdn end============
  },
  configureWebpack: config => {
    // 用cdn方式引入，则构建时要忽略相关资源
    if (isProduction || devNeedCdn) config.externals = cdn.externals
    // 生产环境
    if (isProduction) {
      // ============gzip压缩 start============
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + productionGzipExtensions.join('|') + ')$'
          ),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10k
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      )
      // ============gzip压缩 end============

      // ============公共代码抽离 start============
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: 'all',
              test: /node_modules/,
              name: 'vendor',
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100
            },
            common: {
              chunks: 'all',
              test: /[\\/]src[\\/]js[\\/]/,
              name: 'common',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60
            },
            runtimeChunk: {
              name: 'manifest'
            }
          }
        }
      }
      // ============公共代码抽离 end============
    }
  }
}
