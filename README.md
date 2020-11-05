# fpp-crm-fe

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 项目架构规定
 - 所有http请求全部汇总到/assets/js/api下
 - 每个页面建立对应的常量最后统一抛出
 - 所有的异步请求必须使用try,catch处理异常
 - 和服务约定对应返回码在/assets/js/utils下构建统一处理方法
 - pages目录下是页面开发路径目录结构请严格参照 [nuxt开发路由标准](https://www.nuxtjs.cn/guide/routing)
 - components/basic 下存放公共组件
 - components/pages 下按照pages目录结构存放非公共组件