/** @format */
import { devServer } from "../../../vue.config";

const { proxy } = devServer;
import axios from "axios";
import qs from "qs";
import { handleResponseErrors } from "@/assets/js/utils";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading
} from "./axiosHelperLoading";
// 请求拦截器
axios.interceptors.request.use(
  config => {
    // showFullScreenLoading();
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  // 请求成功
  res => {
    // tryHideFullScreenLoading();
    if (res.status === 200 && res.data.code != undefined) {
      return Promise.resolve(res.data);
    } else {
      handleResponseErrors(res.status, "服务异常，请稍后重试");
      return Promise.reject(res);
    }
  },
  // 请求失败
  error => {
    // tryHideFullScreenLoading();
    if (error.message.includes("timeout")) {
      // 判断请求异常信息中是否含有超时timeout字符串
      handleResponseErrors(9000, "请求超时");
      return Promise.reject(error); // reject这个错误信息
    }
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在200的范围
      // 对接对应返回处理方法（建议分离对应的js文件）
      handleResponseErrors(response.status, "服务异常，请稍后重试");
      return Promise.reject(response);
    } else {
      // 处理断网的情况
    }
  }
);

function ajaxRequest(method, url, type, params = {}, token = true) {
  let contentType = [
    "application/x-www-form-urlencoded",
    "application/json",
    "multipart/form-data"
  ];
  let headers = { "content-type": contentType[type] };
  if (token === true) {
    let FppToken = localStorage.getItem("FppToken");
    if (FppToken) headers["Authorization"] = "Bearer " + FppToken;
  }
  if (type === 0) params = qs.stringify(params);

  if (process.env.NODE_ENV != "development") {
    for (const key in proxy) {
      const regString = Object.keys(proxy[key].pathRewrite)[0];
      const regExp = RegExp(regString);
      if (url.match(regExp)) {
        axios.defaults.baseURL = proxy[key].target;
        url = url.replace(regExp, proxy[key].pathRewrite[regString]);
      }
    }
  }
  let axiosOptions = {
    method,
    url,
    headers,
    timeout: 50000
  };
  if (method.toUpperCase() === "GET") {
    if (
      Object.values(params).some(item => {
        return Array.isArray(item);
      })
    ) {
      axiosOptions["paramsSerializer"] = function(params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
    }
    axiosOptions["params"] = params;
  } else {
    axiosOptions["data"] = params;
  }
  return axios(axiosOptions);
}

export default ajaxRequest;
