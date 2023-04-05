const router = require("koa-router")();
const User = require("../models/userSchema");
const Menu = require("../models/menuSchema");
const Role = require("../models/roles");
const utils = require("../utils/util");
const jwt = require("jsonwebtoken");
const { ParamName } = require("koa-router");
const Counter = require("../models/counterSchema");
const md5 = require("md5");
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
      { userName, userPwd: md5(userPwd) },
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
  const { userId, userName, state } = ctx.request.query;
  const { page, skipIndex } = utils.pager(ctx.request.query);

  let params = {};
  if (userId) params.userId = userId;
  if (userName) params.userName = userName;
  if (state && state != "0") params.state = state;

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

router.post("/operate", async (ctx) => {
  const {
    userId,
    userName,
    userEmail,
    mobile,
    job,
    state,
    roleList,
    deptId,
    action,
  } = ctx.request.body;
  if (action == "add") {
    if (!userName || !userEmail || !deptId) {
      ctx.body = utils.fail("参数错误", utils.CODE.PARAM_ERROR);
      return;
    }
    // 新增用户
    const res = await User.findOne(
      { $or: [{ userName }, { userEmail }] },
      "_id userName userEmail"
    );
    if (res) {
      ctx.body = utils.fail(
        `监测到有重复的用户，信息如下:${res.userName} - ${res.userEmail}`
      );
    } else {
      try {
        const doc = await Counter.findOneAndUpdate(
          { _id: "userId" },
          { $inc: { sequence_value: 1 } }
        );
        const user = new User({
          userId: doc.sequence_value,
          userName,
          userPwd: md5("123456"),
          userEmail,
          role: 1,
          roleList,
          state,
          job,
          deptId,
          mobile,
        });
        user.save();
        ctx.body = utils.success({}, "用户创建成功");
      } catch (error) {
        ctx.fail(error, stack, "用户创建失败");
      }
    }
  } else {
    if (!deptId) {
      ctx.body = utils.fail("部门不能为空", utils.CODE.PARAM_ERROR);
      return;
    }
    try {
      const res = await User.findOneAndUpdate(
        { userId },
        { mobile, job, state, roleList, deptId }
      );
      ctx.body = utils.success(res, "更新成功");
      return;
    } catch (error) {
      ctx.body = utils.fail("更新失败");
    }
  }
});

router.get("/all/list", async (ctx) => {
  try {
    const list = await User.find({}, "userId userName userEmail");
    ctx.body = utils.success(list);
  } catch (error) {
    ctx.body = utils.fail(error.stack);
  }
});

router.get("/getPremissionList", async (ctx) => {
  let authorization = ctx.request.headers.authorization;
  let { data } = utils.decoded(authorization);
  let menuList = await getMenuList(data.role, data.roleList);
  let actionList = getActionList(JSON.parse(JSON.stringify(menuList)));
  ctx.body = utils.success({ menuList, actionList });
});

async function getMenuList(userRole, roleKeys) {
  let rootList = [];
  if (userRole == 0) {
    rootList = (await Menu.find({})) || [];
  } else {
    let roleList = await Role.find({ _id: { $in: roleKeys } });
    let permissionList = [];
    roleList.map((role) => {
      let { checkedKeys, halfCheckedKeys } = role.permissionList;
      console.log(checkedKeys, halfCheckedKeys);
      permissionList = permissionList.concat(
        ...checkedKeys,
        ...halfCheckedKeys
      );
    });
    permissionList = [...new Set(permissionList)];
    rootList = await Menu.find({ _id: { $in: permissionList } });
  }
  return utils.getTree(rootList, null, []);
}

function getActionList(list) {
  const actionList = [];
  const deep = (arr) => {
    while (arr.length) {
      let item = arr.pop();
      if (item.action) {
        item.action.map((action) => {
          actionList.push(action.menuCode);
        });
      }
      if (item.children && !item.action) {
        deep(item.children);
      }
    }
  };
  deep(list);

  return actionList;
}

module.exports = router;
