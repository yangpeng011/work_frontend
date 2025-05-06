<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="工单类型" prop="orderType">-->
<!--        <el-select v-model="queryParams.orderType" placeholder="请选择工单类型" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in dict.type.order_type"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="工单接收人" prop="orderReceiverName">-->
<!--        <el-input-->
<!--          v-model="queryParams.orderReceiverName"-->
<!--          placeholder="请输入工单接收人"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="任务类型" prop="taskType">
        <el-select v-model="queryParams.taskType" placeholder="请选择任务类型" clearable>
          <el-option
            v-for="task in taskOptions"
            :key="task.id"
            :label="task.taskName"
            :value="task.id"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="任务名称" prop="taskName">-->
<!--        <el-input-->
<!--          v-model="queryParams.taskName"-->
<!--          placeholder="请输入任务名称"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="任务开始时间" prop="startTime" label-width="100px">
        <el-date-picker clearable
                        v-model="queryParams.startTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择任务开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务结束时间" prop="endTime" label-width="100px">
        <el-date-picker clearable
                        v-model="queryParams.endTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择任务结束时间">
        </el-date-picker>
      </el-form-item>
<!--      <el-form-item label="工单状态" prop="status">-->
<!--        <el-select v-model="queryParams.status" placeholder="请选择工单状态" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in dict.type.order_status"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--        >修改</el-button>-->
<!--        &lt;!&ndash;           v-hasPermi="['workOrder:workOrder:edit']"-->
<!--&ndash;&gt;-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['workOrder:workOrder:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['workOrder:workOrder:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工单id" align="center" prop="id" />
      <el-table-column label="工单状态" align="center" prop="status" width="150px;">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.order_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="工单类型" align="center" prop="orderType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.order_type" :value="scope.row.orderType"/>
        </template>
      </el-table-column>
      <el-table-column label="派单人" align="center" prop="dispatchNickName" />
      <el-table-column label="接收人" align="center" prop="orderReceiverName" />
      <el-table-column label="任务类型" align="center" prop="taskType">
        <template slot-scope="scope">
          {{ taskOptions.find(item => item.id == scope.row.taskType)?
          taskOptions.find(item => item.id == scope.row.taskType).taskName : '--'}}
          <!--          <dict-tag :options="dict.type.order_task_type" :value="scope.row.taskType"/>-->
        </template>
      </el-table-column>
<!--      <el-table-column label="任务名称" align="center" prop="taskName" />-->
      <el-table-column label="任务数量" align="center" prop="taskNum" />
      <el-table-column label="积分数量" align="center" prop="integralNum" />
        <el-table-column label="任务开始时间" align="center" prop="startTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="任务结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="完成时间" align="center" prop="completeTime" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ parseTime(scope.row.completeTime, '{y}-{m}-{d}') }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="附件" align="center" prop="attachment" />-->
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">

          <el-button
            v-if="scope.row.status ==1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >抢单</el-button>
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

    <!-- 添加或修改工单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <!-- 工单类型 -->
          <el-col :span="12">
            <el-form-item label="工单类型" prop="orderType">
              <el-select v-model="form.orderType" placeholder="请选择工单类型" @change="handleOrderTypeChange">
                <el-option
                  v-for="dict in dict.type.order_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 工单接收人ID -->
          <el-col :span="12">
            <el-form-item label="接收人" prop="orderReceiverId">
              <el-select v-model="form.orderReceiverId" placeholder="请选择接收人" :disabled="form.orderType == 2" filterable>
                <el-option
                  v-for="receiver in receiverOptions"
                  :key="receiver.userId"
                  :label="receiver.nickName"
                  :value="receiver.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- 任务类型 -->
          <el-col :span="12">
            <el-form-item label="任务类型" prop="taskType">
              <el-select v-model="form.taskType" placeholder="请选择任务类型">
                <el-option
                  v-for="task in taskOptions"
                  :key="task.id"
                  :label="task.taskName"
                  :value="task.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 任务数量 -->
          <el-col :span="12">
            <el-form-item label="任务数量" prop="taskNum">
              <el-input-number v-model="form.taskNum" placeholder="请输入任务数量"  :min="1"  style="width: 220px;"  />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- 积分数量 -->
          <el-col :span="12">
            <el-form-item label="积分数量" prop="integralNum">
              <el-input-number v-model="form.integralNum" placeholder="请输入积分数量" :min="0" :step="0.1" :precision="1" style="width: 220px;"/>
            </el-form-item>
          </el-col>
          <!-- 任务开始时间 -->
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime" >
              <el-date-picker
                clearable
                v-model="form.startTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择开始时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- 任务结束时间 -->
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime" >
              <el-date-picker
                clearable
                v-model="form.endTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 附件 -->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="附件" prop="attachment">-->
<!--              <file-upload v-model="form.attachment" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="附件" prop="attachment">
              <file-upload v-model="form.attachment"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 备注 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" :rows="4"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--审核弹框-->
    <el-dialog :title="auditTitle" :visible.sync="openAudit" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <!-- 工单类型 -->
          <el-col :span="12">
            <el-form-item label="工单类型" prop="orderType">
              <el-select v-model="form.orderType" placeholder="请选择工单类型" @change="handleOrderTypeChange" disabled>
                <el-option
                  v-for="dict in dict.type.order_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 工单接收人ID -->
          <el-col :span="12">
            <el-form-item label="接收人" prop="orderReceiverId">
              <el-select v-model="form.orderReceiverId" placeholder="请选择接收人" :disabled="form.orderType == 2" filterable disabled>
                <el-option
                  v-for="receiver in receiverOptions"
                  :key="receiver.userId"
                  :label="receiver.nickName"
                  :value="receiver.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- 任务类型 -->
          <el-col :span="12">
            <el-form-item label="任务类型" prop="taskType">
              <el-select v-model="form.taskType" placeholder="请选择任务类型" disabled>
                <el-option
                  v-for="task in taskOptions"
                  :key="task.id"
                  :label="task.taskName"
                  :value="task.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 任务数量 -->
          <el-col :span="12">
            <el-form-item label="任务数量" prop="taskNum">
              <el-input-number v-model="form.taskNum" placeholder="请输入任务数量"  :min="1"  style="width: 220px;"  disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- 积分数量 -->
          <el-col :span="12">
            <el-form-item label="积分数量" prop="integralNum">
              <el-input-number v-model="form.integralNum" placeholder="请输入积分数量" :min="0" :step="0.1" :precision="1" disabled/>
            </el-form-item>
          </el-col>
          <!-- 任务开始时间 -->
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime" >
              <el-date-picker
                clearable
                v-model="form.startTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择开始时间"
                disabled
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- 任务结束时间 -->
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime" >
              <el-date-picker
                clearable
                v-model="form.endTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择结束时间"
                disabled
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>
        <!-- 备注 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" :rows="4" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="附件" prop="attachment">
              <file-upload v-model="form.attachment" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="佐证文件" prop="evidence">
              <file-upload v-model="form.evidence" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="佐证说明" prop="evidenceDesc">
              <el-input v-model="form.evidenceDesc" type="textarea" placeholder="请输入内容" :rows="4" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="审核结果" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="5">通过</el-radio>
                <el-radio label="4">不通过(返工)</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="审核意见" prop="auditOpinion">
              <el-input v-model="form.auditOpinion" type="textarea" placeholder="请输入审核意见" :rows="4"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="auditSubmit">确 定</el-button>
        <el-button @click="cancelAudit">取 消</el-button>
      </div>
    </el-dialog>

  </div>



</template>

<script>
import {poolList, listWorkOrder, getWorkOrder, delWorkOrder, addWorkOrder, updateWorkOrder,auditWorkOrder,grabOrder } from "@/api/workOrder/order";
import {listUser, selectList} from "@/api/system/user";
import {listTaskConfig} from "@/api/basic/taskConfig";

export default {
  name: "WorkOrderPool",
  dicts: ['order_status', 'order_task_type', 'order_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 工单表格数据
      workOrderList: [],
      // 弹出层标题
      title: "",
      auditTitle:"",
      // 是否显示弹出层 新增/修改
      open: false,
      //审核框
      openAudit:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderType: null,
        orderReceiverName: null,
        taskType: null,
        taskName: null,
        startTime: null,
        endTime: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderType: [
          { required: true, message: "工单类型不能为空", trigger: "change" }
        ],
        taskType: [
          { required: true, message: "任务类型不能为空", trigger: "change" }
        ],
        taskNum: [
          { required: true, message: "任务数量不能为空", trigger: "blur" }
        ],
        integralNum: [
          { required: true, message: "积分数量不能为空", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "任务开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "任务结束时间不能为空", trigger: "blur" }
        ],
      },
      receiverOptions: [],
      taskOptions:[]
    };
  },
  created() {
    this.getList();
    this.getTaskList()

  },
  methods: {
    /** 查询工单列表 */
    getList() {
      this.loading = true;
      this.queryParams.orderType=2
      this.queryParams.status=1

      poolList(this.queryParams).then(response => {
        this.workOrderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelAudit(){
      this.openAudit = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        orderType: '1',
        orderReceiverId: null,
        orderReceiverName: null,
        taskType: null,
        taskName: null,
        taskNum: undefined,
        integralNum: undefined,
        startTime: null,
        endTime: null,
        completeTime: null,
        status: null,
        auditOpinion:null,
        attachment: null,
        evidence:null,
        evidenceDesc: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
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
      this.open = true;
      this.title = "添加工单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids
      const  req = {
        id:id
      }
      this.$modal.confirm('是否确认抢单？').then(function() {
        return grabOrder(req);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("抢单成功");
      }).catch(() => {});
    },

    /** 审核按钮操作 */
    audit(row) {
      this.reset();

      this.getUserList()
      const id = row.id || this.ids
      getWorkOrder(id).then(response => {
        this.form = response.data;
        this.form.status = '5'
        this.form.auditOpinion = ''
        this.openAudit = true;
        this.auditTitle = "审核工单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.orderType == 1){
            // 接收人必须填写
            if(!this.form.orderReceiverId){
              this.$modal.msgError("请选择接收人")
              return false
            }
            this.form.orderReceiverName = this.receiverOptions.find(item => item.userId === this.form.orderReceiverId).nickName


          }
          console.log("submit_params:",this.form)
          if (this.form.id != null) {
            updateWorkOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWorkOrder(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // 审核提交
    auditSubmit(){
      // confirm
      const req = {
        id: this.form.id,
        status: this.form.status,
        auditOpinion: this.form.auditOpinion,
        orderReceiverId: this.form.orderReceiverId,
        integralNum: this.form.integralNum,
      }
      this.$modal.confirm('是否确认审核工单编号为"' + this.form.id + '"的数据项？').then(function() {
        return auditWorkOrder(req);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("审核成功,积分已发放");
        this.openAudit = false;
      }).catch(() => {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除工单编号为"' + ids + '"的数据项？').then(function() {
        return delWorkOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('workOrder/workOrder/export', {
        ...this.queryParams
      }, `workOrder_${new Date().getTime()}.xlsx`)
    },

    /** 工单类型变化处理 */
    handleOrderTypeChange() {
      if (this.form.orderType != 1) {
        this.form.orderReceiverId = null;
        this.form.orderReceiverName = null;
      }
    },
    /** 查询用户列表 */
    getUserList() {
      selectList().then(response => {
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
  }
};
</script>
