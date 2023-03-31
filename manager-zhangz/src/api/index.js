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
  userList(params) {
    return request({
      url: "/users/list",
      method: "get",
      data: params,
      mock: true,
    });
  },
  userDelete(params) {
    return request({
      url: "/users/delete",
      method: "post",
      data: params,
      mock: true,
    });
  },
  getRoleList(){
    return request({
      url: "/roles/allList",
      method: "get",
      mock: true,
    });
  },
  getDeptList(){
    return request({
      url: "/dept/list",
      method: "get",
      mock: true,
    });
  },
  userSubmit(parmas){
    return request({
      url: "/roles/operate",
      method: "post",
      data:parmas,
      mock: true,
    });
  }
};
