import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../components/Home.vue";

const routes = [
  {
    name: "home",
    path: "/",
    meta: {
      title: "首页",
    },
    component: Home,
    redirect: "/welcome",
    children: [
      {
        name: "welcome",
        path: "/welcome",
        component: () => import("../views/Welcome.vue"),
        meta: {
          title: "欢迎页",
        },
      },
      {
        name: "用户管理",
        path: "/system/user",
        meta: {
          title: "用户管理",
        },
        component: () => import("../views/User.vue"),
      },
      {
        name: "菜单管理",
        path: "/system/menu",
        meta: {
          title: "菜单管理",
        },
        component: () => import("../views/Menu.vue"),
      },
      {
        name: "角色管理",
        path: "/system/role",
        meta: {
          title: "角色管理",
        },
        component: () => import("../views/Role.vue"),
      },
      {
        name: "部门管理",
        path: "/system/dept",
        meta: {
          title: "部门管理",
        },
        component: () => import("../views/Dept.vue"),
      },
    ],
  },
  {
    name: "login",
    path: "/login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "登录页",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
