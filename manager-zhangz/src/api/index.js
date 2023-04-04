import request from "../utils/request";

export default {
  login(params) {
    return request({
      url: "/users/login",
      method: "post",
      data: params,
      // mock: false,
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
      method: "get",
      data: {},
      // mock: false,
    });
  },
  userList(params) {
    return request({
      url: "/users/list",
      method: "get",
      data: params,
      // mock: false,
    });
  },
  userDelete(params) {
    return request({
      url: "/users/delete",
      method: "post",
      data: params,
      // mock: false,
    });
  },
  getRoleList() {
    return request({
      url: "/roles/allList",
      method: "get",
      // mock: true,
    });
  },
  getDeptList() {
    return request({
      url: "/dept/list",
      method: "get",
      mock: true,
    });
  },
  userSubmit(parmas) {
    return request({
      url: "/users/operate",
      method: "post",
      data: parmas,
      // mock: false,
    });
  },
  menuSubmit(parmas) {
    return request({
      url: "/menu/operate",
      method: "post",
      data: parmas,
      // mock: true,
    });
  },
  roleList(params){
    return request({
      url: "/roles/list",
      method: "get",
      data: params,
      // mock: true,
    });
  },
  roleOperate(params){
    return request({
      url: "/roles/operate",
      method: "post",
      data: params,
      // mock: true,
    });
  },
  updatePermission(params){
    return request({
      url: "/roles/update/permission",
      method: "post",
      data: params,
      // mock: true,
    });
  }
};
