// 环境的封装

const env = import.meta.env.MODE || "prod";
const EnvConfig = {
  dev: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/e0a62b12c5a0bef67e1edf323669dbe1/api",
  },
  test: {
    baseApi: "//test.future.com/api",
    mockApi:
      "https://www.fastmock.site/mock/9496d91c0cdc682b59c51ac1399cd655/api",
  },
  prod: {
    baseApi: "//future.com/api",
    mockApi:
      "https://www.fastmock.site/mock/9496d91c0cdc682b59c51ac1399cd655/api",
  },
};

export default {
  env,
  mock: false,
  ...EnvConfig[env],
  namespace:'manage'
};
