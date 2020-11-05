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
        path: "/BusinessReview",
        component: __import__("BusinessReview/index"),
        beforeEnter: (to, from, next) => {
          permissionVerify("OperationAudit", to, from, next);
        },
        children: [
          {
            path: "details/:id",
            component: __import__("_type/Auditdetails/_id"),
          }
        ]
      },
      {
        path: "/OperationAudit",
        component: __import__("OperationAudit/index"),
        beforeEnter: (to, from, next) => {
          permissionVerify("OperationAudit", to, from, next);
        },
        children: [
          {
            path: "details/:id",
            component: __import__("_type/Auditdetails/_id"),
          }
        ]
      },
      {
        path: "/FinancialAudit",
        component: __import__("FinancialAudit/index"),
        beforeEnter: (to, from, next) => {
          permissionVerify("FinancialAudit", to, from, next);
        },
        children: [
          {
            path: "details/:id",
            component: __import__("_type/Auditdetails/_id"),
          }
        ]
      },
      {
        path: "/BusinessListings",
        component: __import__("BusinessListings/index"),
        beforeEnter: (to, from, next) => {
          permissionVerify("BusinessListings", to, from, next);
        },
        children: [
          {
            path: "details/:id",
            component: __import__("_type/Auditdetails/_id"),
          }
        ]
      },
      {
        path: "/User",
        component: __import__("organization/user/index"),
        beforeEnter: (to, from, next) => {
          permissionVerify("User", to, from, next);
        }
      },
      {
        path: "/Role",
        component: __import__("organization/role/index"),
        beforeEnter: (to, from, next) => {
          permissionVerify("Role", to, from, next);
        }
      },
      {
        path: "/AgentList",
        component: __import__("agentManagement/agentList/index"),
        beforeEnter: (to, from, next) => {
          permissionVerify("AgentList", to, from, next);
        }
      },
      {
        path: "/ChannelsShare",
        component: __import__("agentManagement/channelsShare/index"),
        beforeEnter: (to, from, next) => {
          permissionVerify("ChannelsShare", to, from, next);
        }
      },
      {
        path: "/PersonalInfo",
        component: __import__("agentManagement/personalInfo/index"),
        beforeEnter: (to, from, next) => {
          permissionVerify("PersonalInfo", to, from, next);
        }
      },
      // {
      //   path: "/:type/details/:id",
      //   component: __import__("_type/Auditdetails/_id"),
      //   beforeEnter: (to, from, next) => {
      //     if (
      //       to.path
      //         .toString()
      //         .match(/(OperationAudit|FinancialAudit|BusinessListings)/)
      //     ) {
      //       next();
      //     } else {
      //       next({ path: "/error" });
      //     }
      //   }
      // }
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

// 路由守卫，title
router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    next();
  } else if (
      typeof localStorage["FppToken"] !== "undefined" &&
      localStorage["FppToken"] !== ""
  ) {
    next();
  } else {
    toLogin();
  }
});

export default router;
