import axios from "axios";
import config from "../config";
import { ElMessage } from "element-plus";
import router from "../router";
import storage from "./storage";

const TOKEN_ERROR = "Token认证失败,请重新登录";
const NET_ERROR = "网络请求异常,请稍后重试";

// 为什么要对axios进行二次封装？ 对请求前和请求后进行统一的处理，如传token、header等
// 创建axios实例  添加配置 进行二次封装

const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
});

// 请求的拦截器
service.interceptors.request.use((req) => {
  // 公共的请求机制
  const header = req.headers;
  const { token = "" } = storage.getItem("userInfo") || {};
  if (!header.Authorization) header.Authorization = "Bearer " + token;
  return req;
});

service.interceptors.response.use((res) => {
  // 公共的响应机制
  const { code, data, msg } = res.data;
  if (code === 200) {
    return data;
  } else if (code === 50001) {
    ElMessage.error(TOKEN_ERROR);
    setTimeout(() => {
      router.push("/login");
    }, 1500);
    return Promise.reject(TOKEN_ERROR);
  } else {
    ElMessage.error(msg || NET_ERROR);
    return Promise.reject(msg || NET_ERROR);
  }
});

// 封装核心的request函数
function request(options) {
  options.method = options.method || "get";
  if (options.method.toLowerCase() === "get") {
    // 统一 传入的属性有data
    options.params = options.data;
  }
  // 如果options mock没有给值的话，其他请求的mock会覆盖config.mock
  // 从而使原本本地请求变为mock请求
  // 解决方案1：api中写死mock:false
  // 解决方案2：let isMock = config.mock 之后的判断都是对isMock的判断与赋值 这样就不会覆盖config.mock
  let isMock = config.mock;
  if (typeof options.mock !== "undefined") {
    isMock = options.mock;
  }

  // 如果不注意 会出现p0级别的bug
  if (config.env === "prod") {
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }
  return service(options);
}

// request的另一种调用方式
["get", "put", "post", "delete"].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options,
    });
  };
});

export default request;
