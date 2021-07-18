<template>
  <div>

    <div class="container">

      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-roundadd"
          class="handle-del mr10"
          @click="showCreate"
        >创建</el-button>

      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column v-if="false" prop="id" label="所属产品编码" />
        <el-table-column prop="appName" label="名称" align="center" />
        <el-table-column prop="appKey" label="key" align="center" />
        <el-table-column prop="appSecret" label="密钥" align="center" />
        <el-table-column prop="appDesc" label="描述" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">

            <el-button
              type="text"
              @click="delDlgShow(scope.$index, scope.row)"
            >删除</el-button>
            <el-button
              type="text"
              @click="viewSecrert(scope.$index, scope.row)"
            >密钥</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageNo"
          :page-size="query.limit"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>

      <el-dialog title="新增应用" :visible.sync="createVisible" width="30%">
        <el-form ref="createForm" :rules="rules" :model="createForm" label-width="90px">
          <el-form-item label="名称" prop="appName" label-width="90px">
            <el-input v-model="createForm.appName" />
          </el-form-item>
          <el-form-item label="key" prop="appKey" label-width="90px">
            <el-input v-model="createForm.appKey" />
          </el-form-item>
          <el-form-item label="描述" prop="appDesc" label-width="90px">
            <el-input v-model="createForm.appDesc" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveCreate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { appListApi, appDeleteApi, openAuthAddApi, appSecretApi } from '../../api/openauth'
export default {
  name: 'AppList',
  data() {
    return {
      createVisible: false,
      createForm: {

      },
      query: {
        paramData: {

        },
        pageNo: 1,
        limit: 10
      },
      tableData: [],
      total: 0,
      form: {},
      rules: {
        appName: [{ required: true, max: 60, message: '请输入名称', trigger: 'blur' }],
        appKey: [{ required: true, max: 60, message: '请输入key', trigger: 'blur' }],
        appDesc: [{ required: true, max: 60, message: '请输入描述', trigger: 'blur' }]
      }
    }
  },
  watch: {
  }, /** method ends*/
  created() {
    this.getData()
  },
  methods: {
    formatActive(row, column, value) {
      return value === 1 ? '在线' : '离线'
    },

    showCreate() {
      this.createVisible = true
    },
    saveCreate() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          openAuthAddApi(this.createForm).then(data => {
            this.$message.success('成功')
            this.createVisible = false
            this.$refs['createForm'].resetFields()
            this.getData()
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '请检查必要参数'
          })
        }
      })
    },
    delDlgShow(index, row) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        appDeleteApi(row.id).then(data => {
          this.$message({
            message: '成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    viewSecrert(index, row) {
      appSecretApi(row.appKey).then(data => {
        row.appSecret = data.data
      })
    },
    handlePageChange(val) {
      this.$set(this.query, 'pageNo', val)
      this.getData()
    },
    getData() {
      const para = this.query
      appListApi(para).then(data => {
        const retValue = data.data
        this.tableData = retValue.resultData
        this.total = retValue.total
      })
    }
  }
}
</script>

<style scoped>

</style>
