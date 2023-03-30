import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8081,
    proxy: {
      //http://localhost:8081/api -> http://localhost:3000/api
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
