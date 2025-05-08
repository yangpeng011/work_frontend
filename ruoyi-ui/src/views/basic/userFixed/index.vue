<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['basic:userFixed:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['basic:userFixed:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['basic:userFixed:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userFixedList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="主键id" align="center" prop="id" />-->
      <el-table-column label="用户编号" align="center" prop="userId" />
      <el-table-column label="用户名称" align="center" prop="userName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改固定单用户配置表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="用户名称" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择用户"  filterable>
            <el-option
              v-for="receiver in receiverOptions"
              :key="receiver.userId"
              :label="receiver.nickName"
              :value="receiver.userId"
            />
          </el-select>
        </el-form-item>
        <el-divider content-position="center">用户固定单配置信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddUserFixedOrderConfig">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteUserFixedOrderConfig">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="userFixedOrderConfigList" :row-class-name="rowUserFixedOrderConfigIndex" @selection-change="handleUserFixedOrderConfigSelectionChange" ref="userFixedOrderConfig"  >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>

          <el-table-column label="派单人" prop="dispatchUserName"  width="130">
            <template slot-scope="scope">
              <el-select v-model="scope.row.dispatchUserName" placeholder="请选择派单人"  filterable>
                <el-option
                  v-for="receiver in receiverOptions"
                  :key="receiver.userId"
                  :label="receiver.nickName"
                  :value="receiver.userName"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="任务名称" prop="taskName">
            <template slot-scope="scope">
              <el-select v-model="scope.row.taskConfigId" placeholder="请选择任务名称"  filterable @change="handleTaskConfigChange(scope.row)">
                <el-option
                  v-for="task in taskOptions"
                  :key="task.id"
                  :label="task.taskName"
                  :value="task.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="任务数量" prop="taskNum" >
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.taskNum"  :min="1" style="width: 140px;"  @change="handleTaskNumChange(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column label="积分数量" prop="integralNum" width="140">
            <template slot-scope="scope">
              <el-input v-model="scope.row.integralNum" disabled />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUserFixed, getUserFixed, delUserFixed, addUserFixed, updateUserFixed } from "@/api/basic/userFixed";
import {selectList} from "@/api/system/user";
import {listTaskConfig} from "@/api/basic/taskConfig";

export default {
  name: "UserFixed",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedUserFixedOrderConfig: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 固定单用户配置表表格数据
      userFixedList: [],
      // 用户固定单配置表格数据
      userFixedOrderConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        userName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: '请选择用户', trigger: 'change' }

        ]
      },
      receiverOptions:[],
      taskOptions:[],

    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询固定单用户配置表列表 */
    getList() {
      this.loading = true;
      listUserFixed(this.queryParams).then(response => {
        this.userFixedList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        userName: null,

      };
      this.userFixedOrderConfigList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getUserList()
      this.getTaskList()
      this.open = true;
      this.title = "添加固定单用户配置表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getUserList()
      this.getTaskList()
      const id = row.id || this.ids
      getUserFixed(id).then(response => {
        this.form = response.data;
        this.userFixedOrderConfigList = response.data.userFixedOrderConfigList;
        this.open = true;
        this.title = "修改固定单用户配置表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //判断this.userFixedOrderConfigList 是否为空
          if(!this.userFixedOrderConfigList.length){
            this.$modal.msgError("配置不能为空")
            return false
          }
          const user = this.receiverOptions.find( item => item.userId === this.form.userId)
          this.form.userName = user.nickName
          // 检验派单人，任务名称不能为空
          for (let i = 0; i < this.userFixedOrderConfigList.length; i++) {
            if(!this.userFixedOrderConfigList[i].dispatchUserName){
              this.$modal.msgError("第"+(i+1)+"行派单人不能为空")
              this.submitLoading = false;
              return false
            }
            if(!this.userFixedOrderConfigList[i].taskConfigId){
              this.$modal.msgError("第"+(i+1)+"行任务名称不能为空")
              this.submitLoading = false;
              return false
            }

          }

          // 用户名称 任务名称赋值
          for (let i = 0; i < this.userFixedOrderConfigList.length; i++) {
            this.userFixedOrderConfigList[i].userId = this.form.userId;
            this.userFixedOrderConfigList[i].userName = user.nickName;
          }
          this.form.userFixedOrderConfigList = this.userFixedOrderConfigList;
          console.log("submit_params:",this.form)
          if (this.form.id != null) {
            updateUserFixed(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUserFixed(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除固定单用户配置表编号为"' + ids + '"的数据项？').then(function() {
        return delUserFixed(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 用户固定单配置序号 */
    rowUserFixedOrderConfigIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 用户固定单配置添加按钮操作 */
    handleAddUserFixedOrderConfig() {
      let obj = {};
      obj.userId = "";
      obj.userName = "";
      obj.dispatchUserName = "";
      obj.taskConfigId = "";
      obj.taskName = "";
      obj.taskNum = "";
      obj.integralNum = "";
      this.userFixedOrderConfigList.push(obj);
    },
    /** 用户固定单配置删除按钮操作 */
    handleDeleteUserFixedOrderConfig() {
      if (this.checkedUserFixedOrderConfig.length == 0) {
        this.$modal.msgError("请先选择要删除的用户固定单配置数据");
      } else {
        const userFixedOrderConfigList = this.userFixedOrderConfigList;
        const checkedUserFixedOrderConfig = this.checkedUserFixedOrderConfig;
        this.userFixedOrderConfigList = userFixedOrderConfigList.filter(function(item) {
          return checkedUserFixedOrderConfig.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleUserFixedOrderConfigSelectionChange(selection) {
      this.checkedUserFixedOrderConfig = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/userFixed/export', {
        ...this.queryParams
      }, `userFixed_${new Date().getTime()}.xlsx`)
    },
    /** 查询用户列表 */
    getUserList() {
      const queryParams = {
        pageNum: 1,
        pageSize: 200,
      }
      selectList(queryParams).then(response => {
          this.receiverOptions = response.data;
        }
      );
    },

    /** 查询任务列表 */
    getTaskList() {
      const queryParams = {
        pageNum: 1,
        pageSize: 100,
      }
      listTaskConfig(queryParams).then(response => {
          this.taskOptions = response.rows;
        }
      );
    },
    handleTaskConfigChange(row) {
      const selectedTask = this.taskOptions.find(task => task.id === row.taskConfigId);
      if (selectedTask) {
        row.integralNum = selectedTask.integralNum*row.taskNum
        row.taskName = selectedTask.taskName
      }
    },
    handleTaskNumChange(row){
      if (!row.taskConfigId) return
      const selectedTask = this.taskOptions.find(task => task.id === row.taskConfigId);
      if (selectedTask){
        row.integralNum = selectedTask.integralNum*row.taskNum

      }
    }
  }
};
</script>
