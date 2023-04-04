const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
// const logger = require('koa-logger')
// const log4js = require('log4js')
const log4js = require("./utils/log4j");
const router = require("koa-router")();
const users = require("./routes/users");
const menus = require("./routes/menus");
const roles = require("./routes/roles");
const jwt = require("jsonwebtoken");
const koajwt = require("koa-jwt");
const util = require("./utils/util");
// error handler
onerror(app);
require("./config/db");
// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
// app.use(logger())
// const logger = log4js.getLogger();
// logger.level = "debug";
// logger.debug("Some debug messages");
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  // 服务端 希望看到前端请求过来的数据
  // const start = new Date()
  log4js.info(`get params:${JSON.stringify(ctx.request.query)}`);
  log4js.info(`post params:${JSON.stringify(ctx.request.body)}`);
  await next().catch((error) => {
    if (error.status == "401") {
      (ctx.status = 200),
        (ctx.body = util.fail("Token认证失败", util.CODE.AUTH_ERROR));
    } else {
      throw error;
    }
  });
  // log4js.info('info output')
  // const ms = new Date() - start
  // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

app.use(
  koajwt({ secret: "jason" }).unless({
    path: [/^\/api\/users\/login/],
  })
);

router.prefix("/api");
router.get("/leave/count", (ctx) => {
  const token = ctx.request.headers.authorization.split(" ")[1];
  const payload = jwt.verify(token, "jason");
  ctx.body = payload;
  // 拿到前端携带过来的token 进行验证
});
router.use(users.routes(), users.allowedMethods());
router.use(menus.routes(), menus.allowedMethods());
router.use(roles.routes(), roles.allowedMethods());
// routes
app.use(router.routes(), router.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
