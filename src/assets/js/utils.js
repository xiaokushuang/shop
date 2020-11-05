/** @format */
import {Message} from "element-ui";
import router from "@/router/index";
import store from "../../store";

/**
 * message提示框
 * @param {String} text 提示文字
 * @param {String} type 提示类型 1 success 2 error 3 warning
 * @param {Number} duration 显示时间
 * @param {Boolean} showClose 是否显示关闭按钮
 */
const showMsg = (text, type = 1, duration = 2, showClose = false) => {
  duration = duration * 1000;
  if (type === 1) {
    Message({
      message: text,
      type: "success",
      duration: duration,
      showClose
    });
  } else if (type === 2) {
    Message({
      message: text,
      type: "error",
      duration: duration,
      showClose
    });
  } else if (type === 3) {
    Message({
      message: text,
      type: "warning",
      duration: duration,
      showClose
    });
  } else {
    Message({
      message: text,
      type,
      duration: duration,
      showClose
    });
  }
};
/**
 * 跳转登录页
 */
const toLogin = () => {
  router.replace({
    path: "/login"
  });
};
const permissionVerify = (flag, to, from, next) => {
  if (localStorage.getItem('fpp-permission') && JSON.parse(localStorage.getItem('fpp-permission')).permissionList) {
    var permissionList = JSON.parse(localStorage.getItem('fpp-permission')).permissionList
  }
//商务审核所包含的权限
  if (flag == 'BusinessReview') {
    if ((permissionList.indexOf(100) !== -1) || (permissionList.indexOf(101) !== -1) || (permissionList.indexOf(102) !== -1)) {
      next();
    } else {
      next({path: from.path});
    }
  }
  //运营审核所包含的权限
  if (flag == 'OperationAudit') {
    if ((permissionList.indexOf(111) !== -1) || (permissionList.indexOf(110) !== -1)) {
      next();
    } else {
      next({path: from.path});
    }
  }
  //财务审核所包含的权限
  if (flag == 'FinancialAudit') {
    if ((permissionList.indexOf(120) !== -1) || permissionList.indexOf(121) !== -1) {
      next();
    } else {
      next({path: from.path});
    }
  }
  //商户列表所包含的权限
  if (flag == 'BusinessListings') {
    if ((permissionList.indexOf(141) !== -1) || (permissionList.indexOf(142) !== -1)) {
      next();
    } else {
      next({path: from.path});
    }
  }
  //用户管理所包含的权限
  if (flag == 'User') {
    if ((permissionList.indexOf(421) !== -1) || (permissionList.indexOf(423) !== -1) || (permissionList.indexOf(424) !== -1)) {
      next();
    } else {
      next({path: from.path});
    }
  }
  //角色管理所包含的权限
  if (flag == 'Role') {
    if (permissionList.indexOf(411) !== -1) {
      next();
    } else {
      next({path: from.path});
    }
  }
  //代理商列表所包含的权限
  if (flag == 'AgentList') {
    if (permissionList.indexOf(311) !== -1 || (permissionList.indexOf(312) !== -1)) {
      next();
    } else {
      next({path: from.path});
    }
  }
  //渠道列表所包含的权限
  if (flag == 'ChannelsShare') {
    if (permissionList.indexOf(321) !== -1) {
      next();
    } else {
      next({path: from.path});
    }
  }
  //个人信息所包含的权限
  if (flag == 'PersonalInfo') {
    if (permissionList.indexOf(331) !== -1) {
      next();
    } else {
      next({path: from.path});
    }
  }
};
/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param {String} msg 请求失败的返回信息
 */
const handleResponseErrors = (status, msg) => {
  switch (status) {
    case 401:
      showMsg("登录过期，请重新登录", "error");
      // 清除token
      localStorage.clear();
      toLogin();
      router.push({name: "Login"});
      break;
    case 404:
      showMsg("网络请求不存在", "error");
      break;
    case 500:
      showMsg("系统错误,请联系管理员", "error");
      break;
    case 1003:
      showMsg("验证码过期", "warning");
      break;
    default:
      showMsg(msg, "error");
      break;
  }
};
/**
 * 通过时间戳生成唯一rid
 */
const formatedRid = () => {
  return new Date().getTime();
};
/**
 * 函数节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
const Throttle = (fn, t) => {
  let last;
  let timer;
  let interval = t || 500;
  return function () {
    let args = arguments;
    let now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn.apply(this, args);
      }, interval);
    } else {
      last = now;
      fn.apply(this, args);
    }
  };
};
/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
const Debounce = (fn, t) => {
  let delay = t || 500;
  let timer;
  // console.log(fn);
  // console.log(typeof fn);
  return function () {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
};
export {
  toLogin,
  permissionVerify,
  showMsg,
  handleResponseErrors,
  formatedRid,
  Throttle,
  Debounce
};
