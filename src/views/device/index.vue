<template>
  <div>
    <div class="container">
      <el-row :gutter="24" style="margin-top: 5px; margin-bottom: 5px">
        <el-col :span="24">
          <el-card shadow="always">
            <el-select
              v-model="search.productCode"
              clearable
              placeholder="请选择产品"
            >
              <el-option
                v-for="item in productList"
                :key="item.productCode"
                :label="item.productName"
                :value="item.productCode"
              />
            </el-select>
            <el-select
              v-model="search.activeStatus" clearable placeholder="在线状态"
              >
              <el-option
                v-for="item in actives"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="search.enableStatus"
              clearable
              placeholder="激活状态"
            >
              <el-option
                v-for="item in enables"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>

            <el-select
              v-model="search.nodeType"
              clearable
              placeholder="节点类型"
            >
              <el-option
                v-for="item in nodeTypes"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
            <el-input
              v-model="search.deviceCode"
              clearable
              placeholder="设备编码"
            />
            <el-input
              v-model="search.deviceName"
              clearable
              placeholder="设备名称"
            />
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
              >搜索</el-button
            >
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 5px; margin-bottom: 5px">
        <el-col :span="24">
          <el-card shadow="always">
            <el-button
              type="primary"
              icon="el-icon-roundadd"
              class="handle-del mr10"
              @click="showBatchCreate"
              >批量创建</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-roundadd"
              class="handle-del mr10"
              @click="showExcelImport"
              >导入</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-roundadd"
              class="handle-del mr10"
              @click="showCreate"
              >创建</el-button
            >
            <el-button type="primary" @click="batchDisable">禁用</el-button>
            <el-button type="primary" @click="batchEnable">激活</el-button>
            <el-button type="primary" @click="batchDel">删除</el-button>
          </el-card>
        </el-col>
      </el-row>

      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="deviceCode" label="设备编码" align="center" />
        <el-table-column prop="deviceName" label="设备名称" align="center" />
        <el-table-column prop="productName" label="所属产品" align="center" />
        <el-table-column prop="gwDevCode" label="所属网关编码" align="center" />
        <el-table-column v-if="false" prop="productCode" label="所属产品编码" />
        <el-table-column v-if="false" prop="nodeType" label="节点类型编码" />
        <el-table-column
          prop="nodeTypeName"
          label="节点类型"
          align="center"
          :formatter="formatNodeType"
        />
        <el-table-column label="设备状态" align="center" width="155">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enableStatus"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="激活"
              inactive-text="禁用"
              :active-value="1"
              :inactive-value="0"
              @change="change(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="lastOnlineTime"
          label="最后上线时间"
          :formatter="formatTimeBC"
          align="center"
        />
        <el-table-column
          prop="activeStatus"
          label="是否在线"
          :formatter="formatActive"
          align="center"
        />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetail(scope.row)"
              >查看</el-button
            >
            <el-button type="text" @click="delDlgShow(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page="query.pageNo"
          :page-size="query.limit"
          :total="total"
          :page-sizes="pageSizes"
          @current-change="handlePageChange"
          @size-change="sizeChange"
        />
      </div>

      <el-dialog title="批量创建设备" :visible.sync="batchVisible" width="30%">
        <el-form ref="form" :model="form" label-width="70px">
          <el-form-item label="数量">
            <el-input
              v-model="form.number"
              type="number"
              @change="$forceUpdate()"
            />
          </el-form-item>
          <el-form-item label="产品列表" prop="productSelected">
            <el-select
              v-model="form.productCode"
              clearable
              placeholder="请选择"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in productList"
                :key="item.productCode"
                :label="item.productName"
                :value="item.productCode"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="batchVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveBatch">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="创建设备" :visible.sync="createVisible" width="30%">
        <el-form
          ref="createForm"
          :rules="rules"
          :model="createForm"
          label-width="90px"
        >
          <el-form-item label="设备编码" prop="deviceCode" label-width="90px">
            <el-input v-model="createForm.deviceCode" />
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName" label-width="90px">
            <el-input v-model="createForm.deviceName" />
          </el-form-item>
          <el-form-item label="设备密钥" prop="deviceSecret" label-width="90px">
            <el-input v-model="createForm.deviceSecret" />
          </el-form-item>
          <el-form-item label="所属产品" prop="productCode" label-width="90px">
            <el-select
              v-model="createForm.productCode"
              prop="productCode"
              clearable
              placeholder="请选择"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in productList"
                :key="item.productCode"
                :label="item.productName"
                :value="item.productCode"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveCreate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog title="导入" :visible.sync="excelImportShow">
      <upload-excel-component
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  deviceSearchApi,
  deviceBatchChgApi,
  deviceBatchAddApi,
  deviceCreateApi,
  deviceImportApi,
} from "../../api/device";
import { productSearchApi } from "../../api/product";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
export default {
  name: "DeviceList",
  components: { UploadExcelComponent },
  data() {
    return {
      isSelected: false,
      createVisible: false,
      excelImportShow: false,
      multipleSelection: [],
      createForm: {},
      pageSizes: [10, 20, 50, 100, 300, 500],
      /** 搜索参数*/
      search: {
        productCode: null,
        enableStatus: null,
        activeStatus: null,
      },
      actives: [
        { value: 1, name: "在线" },
        { value: 0, name: "离线" },
      ],
      enables: [
        { value: 1, name: "激活" },
        { value: 0, name: "未激活" },
      ],
      nodeTypes: [
        { value: "DIRECT", name: "直连设备" },
        { value: "SUB", name: "网关子设备" },
        { value: "GATEWAY", name: "网关设备" },
      ],
      query: {
        paramData: {
          productCode: this.$route.query.code,
        },
        pageNo: 1,
        limit: 10,
      },
      tableData: [],
      total: 0,
      productCode: this.$route.query.code,
      form: {},
      batchVisible: false,
      productList: [],
      rules: {
        productCode: [
          { required: true, max: 60, message: "请选择产品", trigger: "blur" },
        ],
        deviceCode: [
          {
            required: true,
            max: 60,
            message: "请输入设备编码",
            trigger: "blur",
          },
        ],
        deviceName: [
          {
            required: true,
            max: 60,
            message: "请输入设备名称",
            trigger: "blur",
          },
        ],
        deviceSecret: [
          {
            required: true,
            max: 60,
            message: "请输入设备密钥",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    $route: {
      handler() {
        this.productCode = this.$route.query.code;
        this.query = {
          paramData: {
            productCode: this.$route.query.code,
          },
          pageNo: 1,
          limit: 10,
        };
        this.getData();
        // 深度监听，同时也可监听到param参数变化
      },
      deep: true,
    },
  } /** method ends*/,
  created() {
    this.getData();
    this.getProductList();
  },
  methods: {
    sizeChange(val) {
      this.$set(this.query, "limit", val);
      this.getData();
    },
    handleSearch() {
      const para = this.query;
      const paramData = this.search;
      para.paramData = paramData;
      deviceSearchApi(para).then((data) => {
        const retValue = data.data;
        this.tableData = retValue.resultData;
        this.total = retValue.total;
      });
    },
    formatActive(value) {
      return value.activeStatus === 1 ? "在线" : "离线";
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 5;

      if (isLt1M) {
        return true;
      }

      this.$message({
        message: "最大5MB",
        type: "warning",
      });
      return false;
    },
    handleSuccess({ results, header }) {
      console.log(results);
      console.log(header);
      const param = [];
      for (let i = 0; i < results.length; i++) {
        const item = results[i];
        const value = {
          deviceCode: item.设备编码,
          productCode: item.产品编码,
          deviceName: item.设备名称,
          deviceSecret: item.设备密钥,
        };
        param.push(value);
      }
      deviceImportApi(param).then(() => {
        this.$message({
          message: "成功",
          type: "info",
        });
        this.getData();
      });
    },
    showExcelImport() {
      this.excelImportShow = true;
    },
    showCreate() {
      this.createVisible = true;
      this.createForm.productCode = {
        productCode: this.productCode,
      };
    },
    saveCreate() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          deviceCreateApi(this.createForm).then(() => {
            this.$message.success("成功");
            this.createVisible = false;
            this.$refs["createForm"].resetFields();
            this.getData();
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查必要参数",
          });
        }
      });
    },
    showBatchCreate() {
      this.batchVisible = true;
      this.form = {
        productCode: this.productCode,
      };
    },
    viewDetail(row) {
      const param = {
        productCode: row.productCode,
        deviceCode: row.deviceCode,
      };
      this.$router.push({ name: "dev-device-detail", query: param });
    },
    saveBatch() {
      this.$refs["form"].resetFields();
      this.batchVisible = false;
      const param = {
        number: this.form.number,
        productCode: this.form.productCode,
      };
      deviceBatchAddApi(param).then((data) => {
        this.$message.success("成功");
        this.getData();
      });
    },
    delDlgShow(row) {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          const list = [];
          list.push(row.id);
          const param = {
            list: list,
            type: "DELETE",
          };
          this.postUpdateStatus(param);
        })
        .catch(() => {});
    },
    handlePageChange(val) {
      this.$set(this.query, "pageNo", val);
      this.getData();
    },
    getData() {
      const para = this.query;
      const paramData = {
        productCode: this.$route.query.code,
      };
      para.paramData = paramData;
      deviceSearchApi(para).then((data) => {
        const retValue = data.data;
        this.tableData = retValue.resultData;
        this.total = retValue.total;
      });
    },
    change(index, row) {
      // alert(row.enableStatus);
      const list = [];
      list.push(row.id);
      const param = {
        list: list,
      };
      if (row.enableStatus === 1) {
        param.type = "ENABLE";
      } else {
        param.type = "DISABLE";
      }
      this.postUpdateStatus(param);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length > 0) {
        this.isSelected = true;
      }
      // alert(this.multipleSelection.length);
    },
    batchDisable() {
      this.$confirm("确定要禁用吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          this.postUpdateStatus(this.buildChgStatusData("DISABLE"));
        })
        .catch(() => {});
    },
    batchEnable() {
      this.$confirm("确定要启用吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          this.postUpdateStatus(this.buildChgStatusData("ENABLE"));
        })
        .catch(() => {});
    },
    batchDel() {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          this.postUpdateStatus(this.buildChgStatusData("DELETE"));
        })
        .catch(() => {});
    },
    buildChgStatusData(type) {
      const list = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        list.push(this.multipleSelection[i].id);
      }
      const param = {
        list: list,
        type: type,
      };
      return param;
    },
    postUpdateStatus(param) {
      deviceBatchChgApi(param).then(() => {
        this.$message.success("成功");
        this.getData();
      });
    },
    getProductList() {
      const para = {
        paramData: null,
        pageNo: 1,
        limit: 1000,
      };
      productSearchApi(para).then((data) => {
        const retValue = data.data;
        this.productList = retValue.resultData;
      });
    },
  },
};
</script>

<style scoped>
.el-select {
  width: 210px;
}

.el-input {
  width: 130px;
}
</style>
