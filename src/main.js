import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Pabody from "./components/basic/PaBody";
import PaTitle from "./components/basic/PaTitle";
import PaTitleZ from "./components/basic/PaTitleZ";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';//样式文件一定要引入
import "@/assets/css/element.scss";
import "@/assets/css/common.scss";
Vue.use(Pabody)
    .use(ElementUI)
    .use(PaTitle)
    .use(PaTitleZ)
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
