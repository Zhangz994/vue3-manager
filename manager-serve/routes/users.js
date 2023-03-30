const router = require("koa-router")();
const User = require("../models/userSchema");
const utils = require("../utils/util");
const jwt = require("jsonwebtoken");
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
    const res = await User.findOne({ userName, userPwd },'userId userName userEmail state role deptId roleList');
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
    console.log('wozheliyouwenti ');
    ctx.body = utils.fail(error.msg);
  }
});

module.exports = router;
