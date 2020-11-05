module.exports = {
  //   baseUrl: "/datacenter/",
  devServer: {
    // 开发环境下的配置
    host: "0.0.0.0",
    port: 81,
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: process.env.VUE_APP_REQUEST,
        // target: "http://35.223.230.67:8000",
        pathRewrite: { "^/api": "" },
        changeOrigin: true
      }
    },
    before: app => {}
  },
  lintOnSave: false
};
