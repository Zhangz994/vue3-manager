import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "./router";
import App from "./App.vue";
// import axios from "axios";
// import config from "./config";
// 全局引入二次封装的axios
import request from "./utils/request";
// 全局引入二次封装的localstorage
import storage from "./utils/storage";
import api from "./api";
import store from "./store";

const app = createApp(App);

app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;

app.use(router).use(ElementPlus).use(store).mount("#app");
// console.log("环境变量", import.meta.env);
