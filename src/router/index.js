import Vue from "vue";
import VueRouter from "vue-router";
import {toLogin, permissionVerify} from "@/assets/js/utils";
// import store from "../store";
// console.log(store)
Vue.use(VueRouter);
const __import__ = file => () => import(`@/pages/${file}.vue`);
const routes = [
  {
    path: "/login",
    name: "login",
    component: __import__("login/index")
  },
  {
    path: "/",
    component: __import__("index/index"),
    children: [
      {
        path: "/",
        component: __import__("DataCockpit/index")
      },
      {
        path: "/home",
        component: __import__("home/index"),
      },
    ]
  },
];
const router = new VueRouter({
  mode: "history",
  routes
});

// 解决: Error: Avoided redundant navigation to current location:报错显示是路由重复
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
