import request from "../utils/request";

export default {
  login(params) {
    return request({
      url: "/users/login",
      method: "post",
      data: params,
      mock: false,
    });
  },
  noticeCount() {
    return request({
      url: "/leave/count",
      method: "get",
      data: {},
      mock: true,
    });
  },
  menuList() {
    return request({
      url: "/menu/list",
      method: "post",
      data: {},
      mock: true,
    });
  },
};
