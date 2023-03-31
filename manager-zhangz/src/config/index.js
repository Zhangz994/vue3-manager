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
      "https://www.fastmock.site/mock/e0a62b12c5a0bef67e1edf323669dbe1/api",
  },
  prod: {
    baseApi: "//future.com/api",
    mockApi:
      "https://www.fastmock.site/mock/e0a62b12c5a0bef67e1edf323669dbe1/api",
  },
};

export default {
  env,
  mock: false,
  ...EnvConfig[env],
  namespace:'manage'
};
