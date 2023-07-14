const path = require('path')
const resolve = function (dir) {
  return path.join(__dirname, dir)
}
const timeStamp = new Date().getTime()
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false, // 是否开启eslint保存检测
  productionSourceMap: false, // 是否在构建生产包时生成sourcdeMap
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('views', resolve('src/views'))
      .set('util', resolve('src/util'))
      .set('components', resolve('src/components'))
    config.optimization.runtimeChunk('single')
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
  },
  configureWebpack: {
    // webpack 配置
    output: {
      // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `static/js/[name]-${process.env.VUE_APP_Version}-${timeStamp}.js`,
      chunkFilename: `static/js/[name]-${process.env.VUE_APP_Version}-${timeStamp}.js`,
    },
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: true,
    open: true,
    overlay: {
      warning: false,
      error: true,
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001', // 接口域名
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        globalVars: {
          hack: `true; @import '~@/assets/css/config.less';`,
        },
      },
    },
  },
}
