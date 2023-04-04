<template>
  <div class="menu-manage">
    <div class="query-form">
      <el-form :model="queryForm" :inline="true" ref="form">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryForm.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table :data="menuList" style="width: 100%" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleAdd(2, scope.row)"
            >
              新增
            </el-button>
            <el-button size="mini" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row._id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="菜单新增"
      v-model="showModal"
      :before-close="handleCloseDialog"
    >
      <el-form
        :model="menuForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item prop="parentId" label="父级菜单">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          />
          <span>不选则默认是创建一级菜单</span>
        </el-form-item>
        <el-form-item prop="menuType" label="菜单类型">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="menuName" label="菜单名称">
          <el-input
            placeholder="请输入菜单的名称"
            v-model="menuForm.menuName"
          />
        </el-form-item>
        <el-form-item
          prop="icon"
          label="菜单图标"
          v-show="menuForm.menuType == 1"
        >
          <el-input placeholder="请输入菜单图标" v-model="menuForm.icon" />
        </el-form-item>
        <el-form-item
          prop="path"
          label="路由地址"
          v-show="menuForm.menuType == 1"
        >
          <el-input placeholder="请输入路由地址" v-model="menuForm.path" />
        </el-form-item>
        <el-form-item
          prop="menuCode"
          label="权限标识"
          v-show="menuForm.menuType == 2"
        >
          <el-input placeholder="请输入权限标识" v-model="menuForm.menuCode" />
        </el-form-item>
        <el-form-item
          prop="component"
          label="组件路径"
          v-show="menuForm.menuType == 1"
        >
          <el-input placeholder="请输入组件路径" v-model="menuForm.component" />
        </el-form-item>
        <el-form-item
          prop="menuState"
          label="菜单状态"
          v-show="menuForm.menuType == 1"
        >
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 新增 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from "../utils/utils";
export default {
  name: "Menu",
  data() {
    return {
      menuForm: {
        menuType: 1,
        menuState: 1,
        parentId: [null],
      },
      queryForm: {
        menuState: 1,
      },
      menuList: [],
      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "权限标识",
          prop: "menuCode",
        },
        {
          label: "路由地址",
          prop: "path",
        },
        {
          label: "组件路径",
          prop: "component",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          formatter(row, column, value) {
            return {
              1: "正常",
              2: "禁用",
            }[value];
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateData(new Date(value));
          },
        },
      ],
      showModal: false,
      action: "add",
      rules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单的名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 8,
            message: "长度在2-8个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getMenuList() {
      const res = await this.$api.menuList(this.menuForm);
      this.menuList = res;
    },
    handleQuery() {
      this.menuForm.menuState = this.queryForm.menuState;
      this.menuForm.menuName = this.queryForm.menuName;
      this.getMenuList();
    },
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "add";
      if (type == 2) {
        this.menuForm.parentId = [...row.parentId, row._id].filter(
          (item) => item
        );
      }
    },
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      // 为什么用$nextTick可以解决
      this.$nextTick(() => {
        Object.assign(this.menuForm, row);
      });
      // Object.assign(this.menuForm, row);
    },
    async handleDelete(_id) {
      await this.$api.menuSubmit({ _id, action: "delete" });
      this.$message.success("删除成功");
      this.getMenuList();
    },
    handleCloseDialog() {
      this.handleReset("dialogForm");
      this.showModal = false;
    },
    handleClose() {
      this.handleReset("dialogForm");
      this.showModal = false;
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { action, menuForm } = this;
          let params = {
            ...menuForm,
            action,
          };
          await this.$api.menuSubmit(params);
          this.showModal = false;
          this.$message.success("操作成功");
          this.handleReset("dialogForm");
          this.getMenuList();
        }
      });
    },
  },
  mounted() {
    this.getMenuList();
  },
};
</script>

<style></style>
