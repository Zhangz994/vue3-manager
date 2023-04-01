const router = require("koa-router")();
const User = require("../models/userSchema");
const utils = require("../utils/util");
const jwt = require("jsonwebtoken");
const { ParamName } = require("koa-router");
router.prefix("/users");

router.post("/login", async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body;
    /**
     * 返回数据指定字段的三种方式
     * 1 'userId userName userEmail state role deptId roleList'
     * 2 {userId:1 , _id:0} 1代表返回 0代表不返回
     * 3 select('userId')
     */
    const res = await User.findOne(
      { userName, userPwd },
      "userId userName userEmail state role deptId roleList"
    );
    if (res) {
      const data = res._doc;
      const token = jwt.sign(
        {
          data: data,
        },
        "jason",
        { expiresIn: "1h" }
      );
      data.token = token;
      ctx.body = utils.success(data);
    } else {
      ctx.body = utils.fail("用户名或密码不正确");
    }
  } catch (error) {
    console.log("wozheliyouwenti ");
    ctx.body = utils.fail(error.msg);
  }
});

router.get("/list", async (ctx) => {
  const { userId, userName, State } = ctx.request.query;
  const { page, skipIndex } = utils.pager(ctx.request.query);

  let params = {};
  if (userId) params.userId = userId;
  if (userName) params.userName = userName;
  if (State && State != "0") params.state = State;

  try {
    const query = User.find(params, { _id: 0, userPwd: 0 });
    const list = await query.skip(skipIndex).limit(page.pageSize);
    const total = await User.countDocuments(params);

    ctx.body = utils.success({
      page: {
        ...page,
        total,
      },
      list,
    });
  } catch (error) {
    ctx.body = utils.fail(`查询异常${error.stack}`);
  }
});

router.post("/delete", async (ctx) => {
  const { userIds } = ctx.request.body;
  const res = await User.updateMany({ userId: { $in: userIds } }, { state: 2 });
  if (res.modifiedCount) {
    ctx.body = utils.success(res, `共删除成功${res.modifiedCount} 条`);
    return;
  } else {
    ctx.body = utils.fail(`删除失败`);
  }
});

module.exports = router;
